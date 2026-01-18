export interface SignInDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponseDto {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
    };
    session?: {
      access_token: string;
      refresh_token: string;
    };
  };
  error?: string;
}
