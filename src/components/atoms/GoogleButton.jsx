import { FcGoogle } from "react-icons/fc";
import Button from "./Button.jsx";

export default function GoogleButton({ children, ...rest }) {
  return (
    <Button variant="outline" block {...rest}>
      <FcGoogle size={20} aria-hidden="true" />
      {children}
    </Button>
  );
}
