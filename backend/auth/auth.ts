import { auth } from "express-oauth2-jwt-bearer";

export const checkJwt = auth({
  audience: "https://dev-cjzvm88dsutamr5k.eu.auth0.com/api/v2/",
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});
