import { LoginEnum, LogoutEnum, TwoFactorAuthorizationEnum } from "../../common/enum/security.enum.js";
import { ProviderEnum } from "../../common/enum/user.gender.js";
import { ConflictException, NotFoundException } from "../../common/exceptions/error.exception.js";
import { findByIdAndUpdate, findOne } from "../../common/repository/base.repository.js";
import { hashOTP2FA } from "../../common/security/index.js";
import { createLoginCredentials, createRevokeToken, userBaseRevokeTokenKey } from "../../common/security/token.security.js";
import { del, keys } from "../../common/services/index.js";
import { ACCESS_TOKEN_EXPIRES_IN } from "../../config.js";
import { UserModel } from "../../DB/model/user.model.js";
import { sendEmailOtp } from "../authentication/authentication.service.js";

export const profile = async (account)=>{
    return account
}
export const update = async (user, data)=>{
    const account = await findByIdAndUpdate({model: UserModel, id:user._id, update: data})
    return account
}
export const rotateToken = async (payload, user, issuer)=>{
    const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000
    const currentTime =  Date.now()+(30*60000)
    if (currentTime < accessExpiresIn){
        throw ConflictException("Sorry we cannot create new login credientals while current access token still valid within time range!")
    }
    const data = await createLoginCredentials({user, issuer})
    await createRevokeToken({payload})
    return data
}
export const logout = async (payload, user , {action = LogoutEnum.DEVICE})=>{
    
    switch (action) {
        case LogoutEnum.ALL:
            user.changeCredentialsTime = new Date();
            await user.save()
            
            await del({key: await keys({prefix:userBaseRevokeTokenKey({userId:payload.sub})})})
            break;
    
        default:
            await createRevokeToken({payload})
            break;
    }
}
export const requestTwoFactorAuthorization = async ({email, subject}) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    }
  });
  if (account.loginType === 0) {
    subject = TwoFactorAuthorizationEnum.ENABLE
  }
  else {
     subject = TwoFactorAuthorizationEnum.DISABLE
  }
  
  sendEmailOtp({email,subject})
  
}
export const confirmTwoFactorAuthorization = async ({ email, otp }) => {
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
  switch (account.loginType) {
    case LoginEnum.REGULAR:
        await hashOTP2FA({email, otp, subject : TwoFactorAuthorizationEnum.ENABLE, loginTypeEnum : LoginEnum.TWOSTEP, account})
        break;
        default:
        await hashOTP2FA({email, otp, subject : TwoFactorAuthorizationEnum.DISABLE, loginTypeEnum : LoginEnum.REGULAR, account})
        break;
  }
};


