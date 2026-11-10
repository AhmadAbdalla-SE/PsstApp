import { ConflictException } from "../exceptions/error.exception.js";
import { del, get, keys } from "../services/index.js";
import { UserEmailKey } from "../utils/index.js";
import { compare } from "./index.js";

export const hashOTP2FA = async ({email, subject, otp, loginTypeEnum, account})=>{
    await hashAnyOTP({email, subject, otp})
    account.loginType = loginTypeEnum
    await account.save();
}

export const hashAnyOTP = async ({email, subject, otp})=>{
    const hashOtp = await get({
    key: UserEmailKey({ email, subject }),
    });
    if (!hashOtp || !(await compare(otp, hashOtp))) {
        throw ConflictException("Invalid OTP");
    }
    await del({
        key: await keys({prefix: UserEmailKey({email, subject})})
    });
}