import React from "react";
import { useMediaQuery } from "react-responsive";

const PC = ({ children }) => {
	const isPC = useMediaQuery({ minWidth: 1024 });
	return <React.Fragment>{isPC ? children : null}</React.Fragment>;
};

const PCorTablet = ({ children }) => {
	const isPCorTablet = useMediaQuery({ minWidth: 768 });
	return <React.Fragment>{isPCorTablet ? children : null}</React.Fragment>;
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

export { PC, PCorTablet, Tablet, TabletOrMobile, Mobile, Default };
