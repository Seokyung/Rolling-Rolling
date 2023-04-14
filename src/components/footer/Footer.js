import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function Footer() {
	return (
		<footer className="footer-container">
			<span>&copy; {new Date().getFullYear()} Rolling-Rolling</span>
			<span className="footer-developer">
				<a
					href="https://github.com/Seokyung"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FontAwesomeIcon icon={faGithub} />
				</a>
				Seokyung Jee
			</span>
		</footer>
	);
}

export default Footer;
