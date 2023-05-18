import "./Footer.css";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function Footer() {
	return (
		<footer className="footer-container">
			<span>&copy; {new Date().getFullYear()} Rolling-Rolling</span>
			<Tooltip placement="bottom" title="Currently Looking for a Job 👀">
				<span className="footer-developer">
					<a
						href="https://github.com/Seokyung"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FontAwesomeIcon icon={faGithub} />
						Seokyung Jee
					</a>
				</span>
			</Tooltip>
		</footer>
	);
}

export default Footer;
