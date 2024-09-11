import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
  User,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { supabase } from "../supabaseConfig";

export const sendOTP = async (
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
) => {
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier
  );
  return confirmationResult;
};

export const verifyOTP = async (confirmationResult: any, otp: string) => {
  const credential = PhoneAuthProvider.credential(
    confirmationResult.verificationId,
    otp
  );
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
};

export const signInWithSupabase = async (firebaseUser: User) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    phone: firebaseUser.phoneNumber || "",
    password: firebaseUser.uid,
  });
  console.log("supabase response", data, error);
  if (error) {
    if (error.status === 400) {
      const { data, error } = await supabase.auth.signUp({
        phone: firebaseUser.phoneNumber || "",
        password: firebaseUser.uid,
        options: {
          data: {
            companyName: "Jain Distributors",
            address: {
              addressLine1: "Kaipeth Circle",
              city: "Davangere",
              country: "India",
              district: "Davangere",
              pincode: "123456",
              state: "Karnataka",
              addressLine2: "",
            },
            primaryPhoneNumber: "+918123646364",
            type: "Distributor",
          },
        },
      });

      if (error) {
        console.log("supabase signup error");
        throw new Error("Sign-up failed: " + error.message);
      }

      return data.user;
    } else {
      throw error;
    }
  }

  return data.user;
};
