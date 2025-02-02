export interface RegisterData {
    email: string;
    password: string;
    passwordCheck: string;
    acceptTerms: boolean;
  }
  
  export interface LoginData {
    email: string;
    password: string;
    rememberMe: boolean;
  }
  