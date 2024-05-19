import React from 'react';
import styles from '../legacy/css/Header.module.css';
import HeaderNavi from "../legacy/components/HeaderNavi";

const Header = () => {
    return (
        <header className={styles.head}>
            <HeaderNavi></HeaderNavi>
        </header>
    );
};

export default Header;