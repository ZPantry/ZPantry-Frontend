import { Link, useLocation, useNavigate } from "react-router-dom";

export function AppLink({ children, className = "", to, external = false, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (external) {
    return (
      <a className={className} href={to} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  const handleClick = (event) => {
    props.onClick?.(event);
    if (event.defaultPrevented || typeof to !== "string" || !to.includes("#")) return;

    const [pathname = "/", hash = ""] = to.split("#");
    const targetPathname = pathname || location.pathname;
    const targetHash = hash ? `#${hash}` : "";

    if (location.pathname === targetPathname && location.hash === targetHash) {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("app:navigate-hash", { detail: { hash: targetHash } }));
      return;
    }

    navigate(`${targetPathname}${targetHash}`);
    if (targetHash) {
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("app:navigate-hash", { detail: { hash: targetHash } }));
      }, 160);
    }
    event.preventDefault();
  };

  return (
    <Link className={className} to={to} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
