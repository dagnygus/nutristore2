import { createAction, props } from "@ngrx/store";
import { AuthState, LoginModel, NewPasswordModel, RegisterModel, UpdateStateProps, UpdateUserModel } from "../../models/abstract-models";

export const enum AuthActionName {
  signin = '[Auth] Signin.',
  signinStart = '[Auth] Signin start.',
  signup = '[Auth] Signup.',
  signupStart = '[Auth] Signup Start.',
  logout = '[Auth] Logout.',
  updatePassword = '[Auth] Update password.',
  updatePasswordStart = '[Auth] Update password start.',
  updatePasswordSuccess = '[Auth] Update password success.',
  updateUser = '[Auth] Update user.',
  updateUserStart = '[Auth] Update user start.',
  updateAuthState = '[Auth] Update auth state.',
  authStateError = '[Auth] Auth state error.',
  restoreAuthState = '[Auth] restore auth state'
}

export const signin = createAction(AuthActionName.signin, props<{ loginModel: LoginModel }>());
export const signinStart = createAction(AuthActionName.signinStart, props<{ loginModel: LoginModel }>());
export const signup = createAction(AuthActionName.signup, props<{ registerModel: RegisterModel }>());
export const signupStart = createAction(AuthActionName.signupStart, props<{ registerModel: RegisterModel }>());
export const logout = createAction(AuthActionName.logout);
export const updatePassword = createAction(AuthActionName.updatePassword, props<{ newPasswordModel: NewPasswordModel }>());
export const updatePasswordStart = createAction(AuthActionName.updatePasswordStart, props<{ newPasswordModel: NewPasswordModel }>());
export const updatePasswordSuccess = createAction(AuthActionName.updatePasswordSuccess);
export const updateUser = createAction(AuthActionName.updateUser, props<{ updateUserModel: UpdateUserModel }>());
export const updateUserStart = createAction(AuthActionName.updateUserStart, props<{ updateUserModel: UpdateUserModel }>());
export const updateAuthState = createAction(AuthActionName.updateAuthState, props<UpdateStateProps<AuthState>>());
export const authStateError = createAction(AuthActionName.authStateError, props<{ error: any }>());
export const restoreAuthState = createAction(AuthActionName.restoreAuthState, props<{ state: AuthState }>());
