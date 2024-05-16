import React from 'react';
import styles from '../css/Header.module.css';
import HeaderNavi from "../components/HeaderNavi";

const Header = () => {
    return (
        <header className={styles.head}>
            <HeaderNavi></HeaderNavi>
        </header>
    );
};

export default Header;