import { userCreateLambda } from "./userCreate";
import { sendEmailLambda } from "./sendEmail";
import { userLoginLambda } from "./userLogin";
import { Resource } from "@utils/enums/Resource";

export const apiRoutes = [
  {
    method: "POST",
    path: "/user",
    needs: [Resource.DB_PROCESSOR, Resource.EMAIL_SENDER, Resource.BUCKET_IMG_QR],
    lambda: userCreateLambda,
  },
  {
    method: "POST",
    path: "/email",
    needs: [Resource.DB_PROCESSOR, Resource.EMAIL_SENDER, Resource.BUCKET_IMG_QR],
    lambda: sendEmailLambda,
  },
  {
    method: "POST",
    path: "/login",
    needs: [Resource.DB_PROCESSOR],
    lambda: userLoginLambda,
  },
];
