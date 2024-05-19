import styles from '../css/HeaderNavi.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function HeaderNavi(){

    return(
        <div>
            <Container>
                <Row>
                    <Col className={styles.cSiteName}>
                        <p>StockForeVision</p>
                    </Col>
                    <Col className={styles.cSiteDes} xs={7}>
                        <p>predict your own stock!</p>
                    </Col>
                    <Col>
                        <Row>
                            <Col className={styles.loginFont}>
                                <p>login</p>
                            </Col>
                            <Col className={styles.joinFont}>
                                <p>join us</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default HeaderNavi;