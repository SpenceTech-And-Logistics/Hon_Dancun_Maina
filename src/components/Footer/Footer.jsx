import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} P. Wangui Ngirici. All rights
        reserved.
      </p>
    </footer>
  );
}

export default Footer;
