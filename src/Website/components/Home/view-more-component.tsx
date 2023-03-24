import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import ImagesService from "../../../helpers/services/website-images.service";
import NewsService from "../../../helpers/services/website-news.service";
import videoServices from "../../../helpers/services/website-videos.service";
import { WebsiteContentNews } from "../../../helpers/interfaces/websitecontent-news";
import history from "../../../helpers/history";
import ReactHtmlParser, { convertNodeToElement, processNodes } from "react-html-parser";
const ViewMore = () => {
  const [websiteContentNewsFilepath, setWebsiteContentNewsFilepath] =
    useState("");
  let websiteContentNewsData: WebsiteContentNews[] = [];
  const [websiteContentNews, setWebsiteContentNews]: [
    WebsiteContentNews[],
    (websiteContentNews: WebsiteContentNews[]) => void
  ] = React.useState(websiteContentNewsData);
  useEffect(() => {
    getWebsitesiteNews()
  }, [])
  var News: any = [];

  async function getWebsitesiteNews() {
    const response = await NewsService.getNewsInfo();
    console.log("getWebsitesiteNews:: ", response);
    if (response) {
      websiteContentNewsData = response.data;
      setWebsiteContentNews(response.data);
      setWebsiteContentNewsFilepath(response.filepath);
    }
  }
  const options = {
    decodeEntities: true,

  };
  if (websiteContentNews && websiteContentNewsFilepath) {
    News = websiteContentNews.map((news, id) => {
      let imagesrc = `${websiteContentNewsFilepath}${news.newsImageName}`;

      return (
        <Container>
          <Row>
            <div className="col-md-2 col-xl-3 col-12 news-box" key={news.id}>
              {/* <div className="news-box" key={news.id} > */}
              {news.isVideoContent && <video
                width="100%"
                height="170px"
                controls src={imagesrc}
              >
              </video>}

              {!news.isVideoContent && <img src={imagesrc} style={{ width: "200px", height: "200px" }} />}
              <div >
                <h4 className="text-truncate" onClick={() =>
                  history.push(`/readMore`, {
                    id: news.id,
                    field: "websitecontent-news",
                  })}>{news.newsHeader}</h4>

              </div>

              <p className="multitext-truncate">
                {ReactHtmlParser(news.newsDescriptionShortHTML, options)}
                {/* {news.newsDescriptionShortHTML} */}
              </p>

            </div>
            {/* </div> */}
          </Row>
        </Container>

      );
    });
  }

  return (

    <div >
      {News}
    </div>
  )
}
export default ViewMore