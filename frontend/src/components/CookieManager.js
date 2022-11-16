import Cookies from "universal-cookie";

const cookies = new Cookies();

const cookieSet = cookies?.set;
const cookieGet = cookies?.get;
const cookieRemove = cookies?.remove;

export { cookieSet, cookieGet, cookieRemove };
