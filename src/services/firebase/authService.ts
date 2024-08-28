import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { supabase } from "../supabaseConfig";

export const sendOTP = async (phoneNumber: string) => {
  const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });
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

export const createOrUpdateSupabaseUser = async (firebaseUser: any) => {
  const { data, error } = await supabase.from("users").upsert(
    {
      firebase_uid: firebaseUser.uid,
      phone_number: firebaseUser.phoneNumber,
      // Add any other user data you want to store
    },
    {
      onConflict: "firebase_uid",
    }
  );

  if (error) throw error;
  return data;
};
