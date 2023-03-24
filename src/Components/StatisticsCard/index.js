import { Box, Typography, Card, Divider, Icon } from "@material-ui/core";

function StatisticsCard({ color, title, count, percentage, icon, iconwidth }) {
  return (
    <Card style={{
      borderRadius: '10px',
      boxShadow: '0rem 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 10%), 0rem 0.125rem 0.25rem -0.0625rem rgb(0 0 0 / 6%)',
      overflow: 'visible',
      height: '100%'
    }}>

      <Box style={{ display: "flex", justifyContent: "space-between" }} pt={1} px={2}>
        <Box
          style={{
            background: color,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: iconwidth,
            height: "4rem",
            borderRadius: "0.75rem",
            marginTop: '-24px',
            boxShadow: '0rem 0.25rem 1.25rem 0rem rgb(0 0 0 / 14%), 0rem 0.4375rem 0.625rem -0.3125rem rgb(64 64 64 / 40%)',
            opacity: 1
          }}
        >
          <Icon fontSize="medium" >
            {icon}
          </Icon>
        </Box>
        <Box textAlign="right" lineheight={1.25}>
          <p style={{
            margin: '0px',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            letterSpacing: '0.02857em',
            opacity: 1,
            textTransform: 'none',
            verticalAlign: 'unset',
            textDecoration: 'none',
            color: ' rgb(123, 128, 154)',
          }}>
            {title}
          </p>
          <Typography fontWeight="bold" variant="h5" style={{ top: '50%' }}>{count}</Typography>
        </Box>
      </Box>
      <Divider style={{
        margin: '1rem'
      }} />
      <Box pb={2} px={2}>
        <Typography component="p" style={{ display: "flex" }}>
          <Typography
            style={{ color: '#4CAF50' }} component="span"
            fontWeight="bold"
          >
            {percentage.amount}
          </Typography>
          &nbsp;{percentage.label}
        </Typography>
      </Box>


    </Card >
  );
}


export default StatisticsCard;
