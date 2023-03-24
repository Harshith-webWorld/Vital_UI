
// prop-types is a library for typechecking of props
import { Box, Icon, Typography } from "@material-ui/core";
import PropTypes from "prop-types";

function TimelineItem({ key, icon, title, description, lastItem }) {
  return (
    <Box position="relative" mb={3} key={key}>
      <Box
        style={{
          display: "block",
          justifyContent: "center",
          alignItems: "center",
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          position: "absolute",
          top: "8%",
          left: "2px",
          zIndex: 2
        }}
      >
        <Icon fontSize="inherit">{icon}</Icon>
      </Box>
      <Box ml={5.75} pt={description ? 0.7 : 0.5} lineHeight={0} maxWidth="30rem">
        <Typography variant="button" style={{
          margin: '0px',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          letterSpacing: '0.02857em',
          opacity: 1,
          textTransform: 'none',
          verticalAlign: 'unset',
          textDecoration: 'none',
          color: 'rgb(52, 71, 103)',
          fontWeight: 600
        }}>
          {title}
        </Typography>
        {/* <Box mt={0.5}>
          <Typography variant="caption" color={isDark ? "secondary" : "text"}>
            {dateTime}
          </Typography>
        </Box> */}
        <Box mt={2} mb={1.5}>
          {description ? (
            <Typography variant="button" >
              {description}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box >
  );
}


export default TimelineItem;
