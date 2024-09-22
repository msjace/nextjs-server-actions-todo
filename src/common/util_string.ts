export class StringUtil {
  /**
   * Parse Supabase error message
   * @param error Supabase error
   * @returns Error message string
   */
  public static parseSupabaseError(error: any): string {
    switch (error.code) {
      case 'invalid_credentials':
        return 'Email or password is incorrect'
      case 'email_not_confirmed':
        return 'Email has not been authenticated.Please authenticate your email from the authentication email sent to you.'
      case 'otp_expired':
        return 'The authentication email has expired. Please request a new authentication email.'
      default:
        return error.message
    }
  }
}
