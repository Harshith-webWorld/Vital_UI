import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import FAqsService from "../../../helpers/services/website-faqs.service";
import ReactHtmlParser from "react-html-parser";
import { WebsiteContentFaqs } from "../../../helpers/interfaces/websitecontent-faq";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginLeft: '5%',
            fontFamily: 'Poppins ,sans-serif !important',
            fontWeight: 600,
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            // fontWeight: theme.typography.fontWeightRegular,
            fontFamily: 'Poppins ,sans-serif !important',
            fontWeight: 600,
        },
        summary: {
            backgroundColor: '#FF993326',
            marginTop: '5px'
        },
        text_fam: {
            fontFamily: 'Poppins ,sans-serif !important',
            fontWeight: 600,
          },
    }),
)

export default function HomeFaq() {
    const classes = useStyles()
    let websiteContentFaqsData: WebsiteContentFaqs[] = [];
    const [websiteContentFaqs, setWebsiteContentFaqs]: [
        WebsiteContentFaqs[],
        (websiteContentFaqs: WebsiteContentFaqs[]) => void
    ] = React.useState(websiteContentFaqsData);

    React.useEffect(() => {
        getWebsitesiteFaqs();
    }, []);

    const options = {
        decodeEntities: true,

    };
    let Faqs: any = [];
    if (websiteContentFaqs) {
        Faqs = websiteContentFaqs.map((faq, id) => {
            return (
                <Accordion key={id}>
                    <AccordionSummary
                        className={classes.summary}
                        expandIcon={<ExpandMoreIcon style={{ background: '#FF9933', borderRadius: '50%' }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography className={classes.text_fam}>
                            {ReactHtmlParser(faq.answer, options)}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            );
        });
    }
    async function getWebsitesiteFaqs() {
        const response = await FAqsService.getFaqsInfo();
        if (response) {
            console.log("website content Faqs:: ", response.data);
            websiteContentFaqsData = response.data;
            setWebsiteContentFaqs(response.data);
        }
    }
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '50px', marginTop: '100px'}}>
                <Typography variant="h5" className={classes.text_fam} style={{fontSize:'2rem'}} >
                    Frequently Asked Questions
                </Typography>
            </div>
            <Grid container style={{ marginBottom: '50px', marginTop: '15px' }}>
                <Grid item xs={1} >
                </Grid>

                <Grid item xs={10} >
                    {Faqs}
                </Grid>
                <Grid item xs={1}>
                </Grid>
            </Grid>
        </>

    )
}
