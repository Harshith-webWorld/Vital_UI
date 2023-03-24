import React from 'react'
import 'react-multi-carousel/lib/styles.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../../assets/sass/main.css'
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent'
import WebsiteContentService from '../../../helpers/services/website-content.service'
import HomeFooter from '../../Layout/Footer/FooterNew'
import HomeImage from './HomeImage'
import HomeVideo from './HomeVideo'
import HomePageNews from './HomeNews'
import HomeMap from './HomeMap'
import HomeProgramInfo from './HomeProgramInfo'
import HomeFaq from './HomeFaq'
import HomeHeader from '../../Layout/Header/HomeHeader'
const HomeNew: React.FC = () => {
  let WebsiteContentData: WebsiteContent[] = []
  const [websiteContents, setWebsiteContent]: [
    WebsiteContent[],
    (websiteContents: WebsiteContent[]) => void,
  ] = React.useState(WebsiteContentData)

  React.useEffect(() => {
    getWebsitecontent()
  }, [])

  async function getWebsitecontent() {
    const response = await WebsiteContentService.getWebsiteContent()
    if (response) {
      console.log('website content:: ', response.data)
      WebsiteContentData = response.data
      setWebsiteContent(response.data)
    }
  }

  return (
    <div>
      <HomeHeader webSiteContent={websiteContents && websiteContents[0]}/>
      <HomeImage />
      <HomeVideo />
      <HomePageNews />
      <HomeMap />
      <HomeProgramInfo />
      <HomeFaq />
      <HomeFooter webSiteContent={websiteContents && websiteContents[0]} />
    </div>
  )
}

export default HomeNew
