import React from 'react';
import "../css/Footer.css"

const Footer = () => {
    return (
        <footer>
            <div className="footer-container">
                <div className="footer-column">
                    <h3>About Us</h3>
                    <p>
                        From this day forward, let no human make war upon any other human. Let no Terran agency conspire against this
                        new beginning. And let no man consort with alien powers. And to all the enemies of humanity,
                        seek not to bar our way, for we shall win through, no matter the cost.
                        <a href="https://i.namu.wiki/i/RgNWld-OMVwI4bmJMQkD1sUAFaXHWfZ-kHGRhHM9pBSeC5f9rH95X7TMVMAtdbNJ6cFnXOVo5l1r360jswhAhSYiV6C4pN_w9AHUqWLTxISm8T0GQhzI0c6kDBMHVhEc3uPpgl4-k-8KqMq4DSYOug.webp" style={{"text-decoration":"none"}}>Easter Egg</a>
                    </p>
                </div>
                <div className="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Follow Us</h3>
                    <ul>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 stockPred. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;