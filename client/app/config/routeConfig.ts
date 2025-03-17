export const routeConfig = {
  protected: ["/dashboard", "/profile", "/bookings", "/messages"],
  authOnly: ["/sign-in", "/sign-up", "/password-reset"],
  public: ["/", "/about", "/contact", "/services"],
};
