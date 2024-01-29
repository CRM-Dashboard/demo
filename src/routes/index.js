import { useParams } from "react-router-dom";

import GetPublicRoutes from "./PublicRoutes";

export default function Content() {
  const params = useParams();
  //TO-DO : Get identity Ids and validations for private routes
  // set id into state by calling API

  return GetPublicRoutes(params);
}
