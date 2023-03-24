import React, { useState } from 'react'
import {
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { WebsiteContentProgramInfos } from '../../../helpers/interfaces/programInfoInterface'
import ProgramInfoServices from '../../../helpers/services/website-programInfos.service'
import history from '../../../helpers/history'
import ReactHtmlParser from 'react-html-parser'
import { useLocation } from 'react-router-dom'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 151,
    },
    playIcon: {
      height: 38,
      width: 38,
    },
    img_: {
      objectFit: 'cover',
      borderRadius: '5px',
    },
    Tittletext_: {
      fontFamily: 'Poppins !important',
      fontWeight: 600,
      // fontSize: '18px',
      letterSpacing: '0px',
      height: '50px',
    },
    text_fam: {
      fontFamily: 'Poppins ,sans-serif !important',
      fontWeight: 600,
    },
  }),
)

export default function HomeProgramInfo() {
  const classes = useStyles()
  let websiteContentBlogsData: WebsiteContentProgramInfos[] = []
  const [websiteContentBlogs, setWebsiteContentBlogs] = useState(
    websiteContentBlogsData,
  )
  const [
    websiteContentBlogsFilepath,
    setWebsiteContentBlogsFilepath,
  ] = useState('')
  const location = useLocation<any>()
  const options = {
    decodeEntities: true,
  }

  React.useEffect(() => {
    getWebsitesiteBlogs()
  }, [])

  async function getWebsitesiteBlogs() {
    const response = await ProgramInfoServices.getProgramInfosInfo()
    if (response) {
      websiteContentBlogsData = response.data
      setWebsiteContentBlogs(response.data)
      setWebsiteContentBlogsFilepath(response.filepath)
    }
  }
  return (
    <div style={{ background: '#EBFFE3' }}>
      <div style={{ marginLeft: '5%', marginTop: '2%' }}>
        <Typography
         variant="h5"
          className={classes.text_fam}
          style={{
            position: 'relative',
            marginTop: '30px',
            fontWeight: 600,
            top: '25px',
            fontSize:'2rem'
          }}
        >
          Program Information
        </Typography>
      </div>
      <Grid container spacing={3} style={{ marginTop: '30px' }}>
        {websiteContentBlogs.map((blogs: any, index: any) => {
          let blogsrc = `${websiteContentBlogsFilepath}${blogs.programInfoImage}`
          return (
            <Grid
            key={index}
              item
              xs={12}
              md={5}
              lg={5}
              style={{ marginLeft: '4%', marginBottom: '50px' }}
            >
              <div
                className="card"
                style={{ boxShadow: ' 0px 20px 55px #00000029' }}
              >
                <div
                  className="card-horizontal"
                  style={{ display: 'flex', height: '100%' }}
                >
                  <img
                    style={{ margin: '10px', width: '33%' }}
                    className={classes.img_}
                    src={blogsrc}
                    alt="program info"
                  />
                  <div className="card-body" style={{ height: '230px' }}>
                    <h5
                      className={`${classes.Tittletext_} multitext-truncate`}
                      onClick={() =>
                        history.push(`/Homereadmore`, {
                          id: blogs.id,
                          field: 'websitecontent-blog',
                          prevPath: location.pathname,
                        })
                      }
                    >
                      {blogs.programInfoHeader}
                    </h5>
                    <Typography
                      className={`${classes.text_fam} multitext-truncate`}
                      variant="body2"
                      // color="textSecondary"
                      style={{ height: '100px', width: '90%' }}
                    >
                      {ReactHtmlParser(
                        blogs.programInfoDescriptionShortHTML,
                        options,
                      )}
                    </Typography>
                    <div>
                      <a
                      href=''
                        className={`${classes.text_fam} multitext-truncate`}
                        style={{
                          textDecoration: 'underline',
                          letterSpacing: '0px',
                          marginTop: '10px',
                          marginBottom: '20px',
                          marginLeft: '10px',
                          color: '#E68839',
                        }}
                        onClick={() =>
                          history.push(`/Homereadmore`, {
                            id: blogs.id,
                            field: 'websitecontent-blog',
                          })
                        }
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}
