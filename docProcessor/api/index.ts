import { userCreateLambda } from "./userCreate/index";
import type { UserCreateLambdaProps } from "./userCreate/index";
import { sendEmailLambda } from "./sendEmail/index";
import type { SendEmailLambdaProps } from "./sendEmail/index";
import { userLoginLambda } from "./userLogin/index";
import type { UserLoginLambdaProps } from "./userLogin/index";
import { ResourceKey } from "@utils/enums/ResourceKey";

interface ApiRoute<T> {
  method: string;
  path: string;
  lambdaFactory: (props: T) => any;
  needs: ResourceKey[];
}

export const apiRoutes: ApiRoute<any>[] = [
  {
    method: "POST",
    path: "/user",
    lambdaFactory: userCreateLambda,
    needs: [ResourceKey.dbSecret, ResourceKey.email, ResourceKey.qrBucket],
  } as ApiRoute<UserCreateLambdaProps>,
  {
    method: "POST",
    path: "/email",
    lambdaFactory: sendEmailLambda,
    needs: [ResourceKey.dbSecret, ResourceKey.email, ResourceKey.qrBucket],
  } as ApiRoute<SendEmailLambdaProps>,
  {
    method: "POST",
    path: "/login",
    lambdaFactory: userLoginLambda,
    needs: [ResourceKey.dbSecret, ResourceKey.jwtSecret],
  } as ApiRoute<UserLoginLambdaProps>,
];
