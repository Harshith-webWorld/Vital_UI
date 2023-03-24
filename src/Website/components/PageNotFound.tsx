import React, { useEffect, useState,useRef } from 'react';
import ErrorImg from "../assets/img/error.png";
import { Col, Container, Row } from "react-bootstrap";
import Header from "../Layout/Header/Header";
import Footer from "../Layout/Footer/Footer";
import { WebsiteContent } from "../../helpers/interfaces/websitecontent";
import WebsiteContentService from "../../helpers/services/website-content.service";

const PageNotFound: React.FC = () => {
    let WebsiteContentData: WebsiteContent[] = [];
    const [websiteContents, setWebsiteContent]= React.useState(WebsiteContentData);

    React.useEffect(()=>{
       
        getWebsitecontent();
      },[]);
    async function getWebsitecontent() {
        const response = await WebsiteContentService.getWebsiteContent();
        if (response) {
          WebsiteContentData = response.data;
          setWebsiteContent(response.data);
        }
      }
    return (
        <div>
            <Header webSiteContent={websiteContents && websiteContents[0]} />
            <Container>
                <div className="error-page">
                    <img src={ErrorImg} />
                    <h4>404 - PAGE NOT FOUND </h4>
                    <p>Sorry you are not allowded to access the page</p>
                    <button className="btn btn-info">Go to Home</button>
                </div>
            </Container>
            <Footer webSiteContent={websiteContents && websiteContents[0]} />
        </div>
    );
};

export default PageNotFound; 