
function keyPress(event: any) {
  if (
    !(
      (event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      event.charCode == 32
    )
  ) {
    event.preventDefault();
    //console.log("KeyPress", keyPress);
  }
  
}

const checkNumber = key => {
  return (typeof key === "number") && (key >= 0);
}

function onlyAlphabets(event){
  let value = event.target.value;
  let letters = value.replace(/[^a-zA-Z ]/g, "");
  event.target.value = letters;
}


const customStyles = {
  menuPortal: base => ({ ...base, zIndex: '9999' }),
  control: (base) => ({
    ...base,
    borderColor: "#ced4da",
    fontSize: "14px",
    color: "#212529",
    minHeight: "35px",
    height: "35px",
    "&:hover": {
      borderColor: "#ced4da",
    },
  }),
  menu: (base) => ({
    top: "100%",
    backgroundColor: "hsl(0, 0%, 100%)",
    borderRadius: "4",
    boxShadow:
      "0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)",
    marginBottom: "8px",
    marginTop: "8px",
    position: "absolute",
    width: "100%",
    boxSizing: "border-box",
    zIndex: "9999",
  }),
  placeholder: (base) => ({
    color: "#212529",
    fontSize: "13px",
  }),
  indicatorContainer: (base) => ({
    color: "#212529",
  }),
};

function validateNum(event) {
  var count=0
  
  //console.log("event",count);
  count++;
  if (count > 6) {
    
    event.preventDefault();
  }
  
}
const handleWheelEvent = (e: any) => {
  e.target.blur();
}


const commonFunction = {
  
  keyPress,
  customStyles,
  validateNum,
  onlyAlphabets,
  checkNumber,
  handleWheelEvent
  
};


export default commonFunction;
