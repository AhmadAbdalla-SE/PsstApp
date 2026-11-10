import { OAuth2Client } from "google-auth-library";
import { EmailSubjectEnum } from "../../common/enum/email.enum.js";
import { LoginEnum, TwoFactorAuthorizationEnum } from "../../common/enum/security.enum.js";
import { ProviderEnum } from "../../common/enum/user.gender.js";
import {
  BadException,
  ConflictException,
  NotFoundException,
  TooManyRequestException,
} from "../../common/exceptions/index.js";
import { create, findOne } from "../../common/repository/base.repository.js";
import {
  compare,
  createLoginCredentials,
  encryption,
  hash,
  hashAnyOTP,
  userBaseRevokeTokenKey,
} from "../../common/security/index.js";
import { del, expire, get, incBy, keys, set, ttl } from "../../common/services/cache.service.js";
import {
  createOtp,
  emailEvent,
  UserEmailKey,
  UserEmailKeyLogin,
  UserEmailTrialsKey
} from "../../common/utils/index.js";
import { WEB_CLIENT_IDS } from "../../config.js";
import { UserModel } from "../../DB/model/user.model.js";


const client = new OAuth2Client();

async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: WEB_CLIENT_IDS,
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified) {
    throw BadException("Email not verified");
  }
  return payload;
}

export const signupWithGmail = async ({ idToken }, issuer) => {
  const { name, email, picture } = await verifyGoogleAccount(idToken);

  const existAccount = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (existAccount) {
    if (existAccount.provider != ProviderEnum.GOOGLE) {
      throw ConflictException("Invalid Account Provider");
    }
    return {
      status: 200,
      data: await createLoginCredentials({ user: existAccount, issuer }),
    };
  }
  const user = await create({
    model: UserModel,
    data: {
      username: name,
      email,
      confirmEmail: new Date(),
      provider: ProviderEnum.GOOGLE,
      image: picture,
    },
  });
  return { status: 201, data: await createLoginCredentials({ user, issuer }) };
};

export const confirmEmail = async ({ email, otp }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
    options: { select: "email" },
  });
  if (!account) {
    throw NotFoundException("Invalid Account");
  }
  const hashOtp = await get({
    key: UserEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }),
  });
  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw ConflictException("Invalid OTP");
  }

  account.confirmEmail = new Date();
  await account.save();
  await del({
    key: await keys({prefix: UserEmailKey({email, subject: EmailSubjectEnum.CONFIRM_EMAIL})})
  });
  return;
};
export const resendConfirmEmail = async ({ email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
    options: { select: "email" },
  });
  if (!account) {
    throw NotFoundException("Invalid Account");
  }
  await sendEmailOtp({email, subject:EmailSubjectEnum.CONFIRM_EMAIL})
  return;
};
export const requestForgotPasswordCode = async ({ email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
    options: { select: "email" },
  });
  if (!account) {
    throw NotFoundException("Invalid Account");
  }
  await sendEmailOtp({email, subject:EmailSubjectEnum.FORGOT_PASSWORD})
  return;
};

export const verifyForgotPasswordCode  = async ({ email, otp }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
    options: { select: "email" },
  });
  if (!account) {
    throw NotFoundException("Invalid Account");
  }
  const hashOtp = await get({
    key: UserEmailKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }),
  });
  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw ConflictException("Invalid OTP");
  }
  return account
};
export const resetForgotPassword  = async ({ email, otp, password }) => {
    const account = await verifyForgotPasswordCode({otp, email})
    account.password = await hash(password)
    account.changeCredentialsTime = new Date();
    await account.save()

    const result = await Promise.all([
        keys({prefix: userBaseRevokeTokenKey({userId: account._id}) }), 
        keys({prefix: UserEmailKey({email, subject: EmailSubjectEnum.FORGOT_PASSWORD}) }) 
      ])
    await del({
      key: [...result[0], ...result[1]]
    });
    return
  };
export const signup = async ({ email, password, username, phone }) => {
  const duplicatedAccount = await findOne({
    model: UserModel,
    filter: { email },
    options: { select: "email" },
  });
  if (duplicatedAccount) throw ConflictException("Email Exists");

  const account = await create({
    model: UserModel,
    data: {
      email,
      password: await hash(password),
      username,
      phone: await encryption(phone),
    },
  });
  sendEmailOtp({email, subject:EmailSubjectEnum.CONFIRM_EMAIL})
  return account
};
export const sendEmailOtp = async ({email, subject , expiresIn = 120, maxTrials = 3, blockInSeconds = 300, title}) => {
    const existOTP_TTl = await ttl({key: UserEmailKey({email,subject}), })
    if (existOTP_TTl>0){
        throw ConflictException(`Sorry we cannot create new otp while existing one is still valid, please try again later after ${existOTP_TTl} seconds`)
    }
    const oldTrials = await get({key:UserEmailTrialsKey({email, subject})})??0
    if (oldTrials >= maxTrials) {
        throw TooManyRequestException("Reached maximum otp trials")
    }
  const code = createOtp();
  await set({
    key: UserEmailKey({ email, subject }),
    value: await hash(code.toString()),
    ttl: expiresIn,
  });
  const currentTrials = await incBy({key: UserEmailTrialsKey({email,subject})})
  if (currentTrials == 3){
    await expire({key:UserEmailTrialsKey({email,subject}), ttl: blockInSeconds})
  }
  emailEvent.emit("sendEmail", {
    recipients: { to: email },
    subject,
    data: { code, title: title ?? subject },
  });
};

export const login = async ({ email, password, maxTrials = 5, blockInSeconds = 10 }, issuer) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });
const attemptsKey = UserEmailKeyLogin({ email });
const blockKey = `${attemptsKey}:blocked`;

// check if user is blocked
const blockTTL = await ttl({ key: blockKey });

if (blockTTL > 0) {
    throw TooManyRequestException(
        `Too many attempts. Try again in ${blockTTL} seconds.`
    );   
}
if (!account) {
    throw NotFoundException("Invalid Credentials");
}

const match = await compare(password, account.password);

if (!match) {
    // increment failed attempts
    const currentTrials = Number(
        await incBy({ key: attemptsKey })
    );

    // block after the maximum number of failures
    if (currentTrials >= maxTrials) { 
        await set({
            key: blockKey,
            value: "1"
        });
        await set({
            key: attemptsKey,
            value: "0"
        });

        await expire({
            key: blockKey,
            ttl: blockInSeconds
        });

        throw TooManyRequestException(
            "Too many failed login attempts. Please try again later."
        );
    }

    throw NotFoundException("Invalid Credentials");
}
  
  switch (account.loginType) {
    case LoginEnum.TWOSTEP:
      await del({ key: UserEmailKeyLogin({ email }) });
      sendEmailOtp({email, subject: TwoFactorAuthorizationEnum.LOGIN})
      break;
      default:
        await set({
            key: attemptsKey,
            value: "0"
        });
       return await createLoginCredentials({ user: account, issuer })
    }
};
      
export const confirmLogin = async ({email, otp}, issuer) =>{
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    }
  });
  if (!account) {
    throw NotFoundException("Invalid Account");
  }
  await hashAnyOTP({email, subject: TwoFactorAuthorizationEnum.LOGIN , otp})
  return await createLoginCredentials({ user: account, issuer })
};