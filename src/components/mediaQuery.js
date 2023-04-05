import React from "react";
import { useMediaQuery } from "react-responsive";

const Desktop = ({ children }) => {
	const isDesktop = useMediaQuery({ minWidth: 1024 });
	return <React.Fragment>{isDesktop ? children : null}</React.Fragment>;
};

const Tablet = ({ children }) => {
	const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
	return <React.Fragment>{isTablet ? children : null}</React.Fragment>;
};

const TabletOrMobile = ({ children }) => {
	const isTabletOrMobile = useMediaQuery({ maxWidth: 1023 });
	return <React.Fragment>{isTabletOrMobile ? children : null}</React.Fragment>;
};

const Mobile = ({ children }) => {
	const isMobile = useMediaQuery({ maxWidth: 767 });
	return <React.Fragment>{isMobile ? children : null}</React.Fragment>;
};

const Default = ({ children }) => {
	const isNotMobile = useMediaQuery({ minWidth: 768 });
	return <React.Fragment>{isNotMobile ? children : null}</React.Fragment>;
};

export { Desktop, Tablet, TabletOrMobile, Mobile, Default };
