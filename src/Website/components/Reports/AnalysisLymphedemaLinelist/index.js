import React, { useState, useEffect } from 'react';
const AnalysisLymphedemaLinelist = () => {
    return (
        <div>
            <style>{`
    table{
      border-collapse: collapse;
       width:100%;

    }
    th ,td{ border: 1px solid black; }
    td {
      text-align: center;
      padding: 6px;
    }
  `}</style>
            <div style={{ marginTop: '3%', marginBottom: '3%' }}>
                <table border="0" cellpadding="0" cellspacing="0" id="sheet0" class="sheet0 gridlines">

                    <tbody>
                        <tr>
                            <td class="column0 style1 s">Disease Cases</td>
                        </tr>
                        <tr class="row1">
                            <td class="column0 style3 s style5" rowspan="2">Name Of Patient</td>
                            <td class="column1 style3 s style5" rowspan="2">Patient ID</td>
                            <td class="column2 style3 s style5" rowspan="2">Gender</td>
                            <td class="column3 style3 s style5" rowspan="2">District</td>
                            <td class="column4 style3 s style5" rowspan="2">Corporation</td>
                            <td class="column5 style3 s style5" rowspan="2">Taluka</td>
                            <td class="column6 style3 s style5" rowspan="2">Zone</td>
                            <td class="column7 style3 s style5" rowspan="2">Ward</td>
                            <td class="column8 style3 s style5" rowspan="2">Village</td>
                            <td class="column9 style3 s style5" rowspan="2">Facility/PHC</td>
                            <td class="column10 style3 s style5" rowspan="2">Year</td>
                            <td class="column11 style3 s style5" rowspan="2">Month</td>
                            <td class="column12 style3 s style5" rowspan="2">Age</td>
                            <td class="column13 style3 s style5" rowspan="2">Mobile No</td>
                            <td class="column14 style3 s style5" rowspan="2">Adress</td>
                            <td class="column15 style3 s style5" rowspan="2">Desese Type </td>
                            <td class="column16 style4 s style4" colspan="6">Is Affected</td>
                            <td class="column22 style3 s style5" rowspan="2">Grading</td>
                            <td class="column23 style3 s style5" rowspan="2">Presence Of Blisters</td>
                            <td class="column24 style3 s style5" rowspan="2">Duration Of Disease</td>


                        </tr>
                        <tr class="row2">
                            <td class="column16 style6 s">Leg</td>
                            <td class="column17 style6 s">Hand</td>
                            <td class="column18 style6 s">Scrotum</td>
                            <td class="column19 style6 s">Breast</td>
                            <td class="column20 style6 s">Others</td>
                            <td class="column21 style6 s">Specify Other Notes</td>

                        </tr>
                        <tr>
                            <td class="column25">&nbsp;</td>
                            <td class="column26">&nbsp;</td>
                            <td class="column27">&nbsp;</td>
                            <td class="column28">&nbsp;</td>
                            <td class="column29">&nbsp;</td>
                            <td class="column30">&nbsp;</td>
                            <td class="column25">&nbsp;</td>
                            <td class="column26">&nbsp;</td>
                            <td class="column27">&nbsp;</td>
                            <td class="column28">&nbsp;</td>
                            <td class="column29">&nbsp;</td>
                            <td class="column30">&nbsp;</td>
                            <td class="column25">&nbsp;</td>
                            <td class="column26">&nbsp;</td>
                            <td class="column27">&nbsp;</td>
                            <td class="column28">&nbsp;</td>
                            <td class="column29">&nbsp;</td>
                            <td class="column30">&nbsp;</td>
                            <td class="column25">&nbsp;</td>
                            <td class="column26">&nbsp;</td>
                            <td class="column27">&nbsp;</td>
                            <td class="column28">&nbsp;</td>
                            <td class="column29">&nbsp;</td>
                            <td class="column30">&nbsp;</td>
                            <td >&nbsp;</td>

                        </tr>
                    </tbody>
                </table>
            </div>


            <div style={{ marginTop: '3%', marginBottom: '3%' }}>
                <table border="0" cellpadding="0" cellspacing="0" id="sheet0" class="sheet0 gridlines">

                    <tbody>
                        <tr>
                            <td> Hydrocele operation line list</td>
                        </tr>
                        <tr>
                            <td class="column0 style3 s style5" rowspan="2">Name Of Patient</td>
                            <td class="column1 style3 s style5" rowspan="2">Patient ID</td>
                            <td class="column2 style3 s style5" rowspan="2">Gender</td>
                            <td class="column3 style3 s style5" rowspan="2">District</td>
                            <td class="column4 style3 s style5" rowspan="2">Corporation</td>
                            <td class="column5 style3 s style5" rowspan="2">Taluka</td>
                            <td class="column6 style3 s style5" rowspan="2">Zone</td>
                            <td class="column7 style3 s style5" rowspan="2">Ward</td>
                            <td class="column8 style3 s style5" rowspan="2">Village</td>
                            <td class="column9 style3 s style5" rowspan="2">Facility/PHC</td>
                            <td class="column10 style3 s style5" rowspan="2">Year</td>
                            <td class="column11 style3 s style5" rowspan="2">Month</td>
                            <td class="column12 style3 s style5" rowspan="2">Age</td>
                            <td class="column13 style3 s style5" rowspan="2">Mobile No</td>
                            <td class="column14 style3 s style5" rowspan="2">Adress</td>
                            <td class="column15 style3 s style5" rowspan="2">Desese Type </td>
                            <td class="column16 style3 s style5" rowspan="2">Grading</td>
                            <td class="column17 style3 s style5" rowspan="2">Presence Of Blisters</td>
                            <td class="column18 style3 s style5" rowspan="2">Duration Of Disease</td>
                            <td class="column19 style4 s style4" colspan="4">Details of Service Provider</td>
                            <td class="column23 style3 s style5" rowspan="2">Co-Morbidity Type</td>
                            <td class="column24 style3 s style5" rowspan="2">Date Of Surgery</td>
                            <td class="column25 style3 s style5" rowspan="2">Name Of Hospital Where Surgery Done</td>
                            <td class="column26 style3 s style5" rowspan="2">Stage Of Hydrocele</td>
                            <td class="column27 style3 s style5" rowspan="2">Name Of Surgeon</td>
                            <td class="column28 style3 s style5" rowspan="2">Surgeon's Mobile Number</td>
                            <td class="column29 style3 s style5" rowspan="2">Date Of Follow Up After Surgery</td>
                            <td class="column30 style3 s style5" rowspan="2">Findings During Follow Up</td>
                        </tr>
                        <tr>
                            <td class="column19 style6 s">Name</td>
                            <td class="column20 style6 s">Designation</td>
                            <td class="column21 style6 s">Place Of Service Given</td>
                            <td class="column22 style6 s">Phone Number</td>
                        </tr>
                        <tr>

                            <td class="column31">&nbsp;</td>
                            <td class="column32">&nbsp;</td>
                            <td class="column33">&nbsp;</td>
                            <td class="column34">&nbsp;</td>
                            <td class="column35">&nbsp;</td>
                            <td class="column36">&nbsp;</td>
                            <td class="column37">&nbsp;</td>
                            <td class="column38">&nbsp;</td>
                            <td class="column39">&nbsp;</td>
                            <td class="column40">&nbsp;</td>
                            <td class="column41">&nbsp;</td>
                            <td class="column42">&nbsp;</td>
                            <td class="column43">&nbsp;</td>
                            <td class="column44">&nbsp;</td>
                            <td class="column45">&nbsp;</td>
                            <td class="column46">&nbsp;</td>
                            <td class="column47">&nbsp;</td>
                            <td class="column48">&nbsp;</td>
                            <td class="column49">&nbsp;</td>
                            <td class="column50">&nbsp;</td>
                            <td class="column51">&nbsp;</td>
                            <td class="column52">&nbsp;</td>
                            <td class="column53">&nbsp;</td>
                            <td class="column54">&nbsp;</td>
                            <td class="column55">&nbsp;</td>
                            <td class="column56">&nbsp;</td>
                            <td class="column57">&nbsp;</td>
                            <td class="column58">&nbsp;</td>
                            <td class="column59">&nbsp;</td>
                            <td class="column60">&nbsp;</td>
                            <td class="column61">&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '3%', marginBottom: '3%' }}>
                <table border="0" cellpadding="0" cellspacing="0" id="sheet0" class="sheet0 gridlines">

                    <tbody>
                        <tr>
                            <td class="column0 style1 s"><a class="comment-indicator"></a><div class="comment">Shyam Kumar C:<br />
                                Is Surgery Done? Yes<br />
                            </div>
                                Hydrocele operation line list</td>
                        </tr>
                        <tr>
                            <td class="column0 style3 s style5" rowspan="2">Name Of Patient</td>
                            <td class="column1 style3 s style5" rowspan="2">Patient ID</td>
                            <td class="column2 style3 s style5" rowspan="2">Gender</td>
                            <td class="column3 style3 s style5" rowspan="2">District</td>
                            <td class="column4 style3 s style5" rowspan="2">Corporation</td>
                            <td class="column5 style3 s style5" rowspan="2">Taluka</td>
                            <td class="column6 style3 s style5" rowspan="2">Zone</td>
                            <td class="column7 style3 s style5" rowspan="2">Ward</td>
                            <td class="column8 style3 s style5" rowspan="2">Village</td>
                            <td class="column9 style3 s style5" rowspan="2">Facility/PHC</td>
                            <td class="column10 style3 s style5" rowspan="2">Year</td>
                            <td class="column11 style3 s style5" rowspan="2">Month</td>
                            <td class="column12 style3 s style5" rowspan="2">Age</td>
                            <td class="column13 style3 s style5" rowspan="2">Mobile No</td>
                            <td class="column14 style3 s style5" rowspan="2">Adress</td>
                            <td class="column15 style3 s style5" rowspan="2">Desese Type </td>
                            <td class="column16 style3 s style5" rowspan="2">Grading</td>
                            <td class="column17 style3 s style5" rowspan="2">Presence Of Blisters</td>
                            <td class="column18 style3 s style5" rowspan="2">Duration Of Disease</td>
                            <td class="column19 style4 s style4" colspan="4">Details of Service Provider</td>
                            <td class="column23 style3 s style5" rowspan="2">Co-Morbidity Type</td>

                        </tr>
                        <tr>
                            <td class="column19 style6 s">Name</td>
                            <td class="column20 style6 s">Designation</td>
                            <td class="column21 style6 s">Place Of Service Given</td>
                            <td class="column22 style6 s">Phone Number</td>
                        </tr>
                        <tr>

                            <td class="column31">&nbsp;</td>
                            <td class="column32">&nbsp;</td>
                            <td class="column33">&nbsp;</td>
                            <td class="column34">&nbsp;</td>
                            <td class="column35">&nbsp;</td>
                            <td class="column36">&nbsp;</td>
                            <td class="column37">&nbsp;</td>
                            <td class="column38">&nbsp;</td>
                            <td class="column39">&nbsp;</td>
                            <td class="column40">&nbsp;</td>
                            <td class="column41">&nbsp;</td>
                            <td class="column42">&nbsp;</td>
                            <td class="column43">&nbsp;</td>
                            <td class="column44">&nbsp;</td>
                            <td class="column45">&nbsp;</td>
                            <td class="column46">&nbsp;</td>
                            <td class="column47">&nbsp;</td>
                            <td class="column48">&nbsp;</td>
                            <td class="column49">&nbsp;</td>
                            <td class="column50">&nbsp;</td>
                            <td class="column51">&nbsp;</td>
                            <td class="column52">&nbsp;</td>
                            <td class="column53">&nbsp;</td>
                            <td class="column54">&nbsp;</td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '3%', marginBottom: '3%' }}>
                <table border="0" cellpadding="0" cellspacing="0" id="sheet0" class="sheet0 gridlines">

                    <tbody>
                        <tr>
                            <td> Hydrocele operation line list</td>
                        </tr>
                        <tr>
                            <td class="column0 style3 s style5" rowspan="2">Name Of Patient</td>
                            <td class="column1 style3 s style5" rowspan="2">Patient ID</td>
                            <td class="column2 style3 s style5" rowspan="2">Gender</td>
                            <td class="column3 style3 s style5" rowspan="2">District</td>
                            <td class="column4 style3 s style5" rowspan="2">Corporation</td>
                            <td class="column5 style3 s style5" rowspan="2">Taluka</td>
                            <td class="column6 style3 s style5" rowspan="2">Zone</td>
                            <td class="column7 style3 s style5" rowspan="2">Ward</td>
                            <td class="column8 style3 s style5" rowspan="2">Village</td>
                            <td class="column9 style3 s style5" rowspan="2">Facility/PHC</td>
                            <td class="column10 style3 s style5" rowspan="2">Year</td>
                            <td class="column11 style3 s style5" rowspan="2">Month</td>
                            <td class="column12 style3 s style5" rowspan="2">Age</td>
                            <td class="column13 style3 s style5" rowspan="2">Mobile No</td>
                            <td class="column14 style3 s style5" rowspan="2">Adress</td>
                            <td class="column15 style3 s style5" rowspan="2">Desese Type </td>
                            <td class="column16 style3 s style5" rowspan="2">Grading</td>
                            <td class="column17 style3 s style5" rowspan="2">Presence Of Blisters</td>
                            <td class="column18 style3 s style5" rowspan="2">Duration Of Disease</td>
                            <td class="column19 style4 s style4" colspan="4">Details of Service Provider</td>
                            <td class="column23 style3 s style5" rowspan="2">Co-Morbidity Type</td>
                            <td class="column23 style3 s style5" rowspan="2">Surgery Not Possible Resasons</td>
                        </tr>
                        <tr>
                            <td class="column19 style6 s">Name</td>
                            <td class="column20 style6 s">Designation</td>
                            <td class="column21 style6 s">Place Of Service Given</td>
                            <td class="column22 style6 s">Phone Number</td>
                        </tr>
                        <tr>
                            <td class="column31">&nbsp;</td>
                            <td class="column32">&nbsp;</td>
                            <td class="column33">&nbsp;</td>
                            <td class="column34">&nbsp;</td>
                            <td class="column35">&nbsp;</td>
                            <td class="column36">&nbsp;</td>
                            <td class="column37">&nbsp;</td>
                            <td class="column38">&nbsp;</td>
                            <td class="column39">&nbsp;</td>
                            <td class="column40">&nbsp;</td>
                            <td class="column41">&nbsp;</td>
                            <td class="column42">&nbsp;</td>
                            <td class="column43">&nbsp;</td>
                            <td class="column44">&nbsp;</td>
                            <td class="column45">&nbsp;</td>
                            <td class="column46">&nbsp;</td>
                            <td class="column47">&nbsp;</td>
                            <td class="column48">&nbsp;</td>
                            <td class="column49">&nbsp;</td>
                            <td class="column50">&nbsp;</td>
                            <td class="column51">&nbsp;</td>
                            <td class="column52">&nbsp;</td>
                            <td class="column53">&nbsp;</td>
                            <td class="column54">&nbsp;</td>
                            <td class="column55">&nbsp;</td>


                        </tr>
                    </tbody>
                </table>
            </div>


            <div style={{ marginTop: '3%', marginBottom: '3%' }}>
                <table border="0" cellpadding="0" cellspacing="0" id="sheet0" class="sheet0 gridlines">

                    <tbody>
                        <tr>
                            <td class="column0 style1 s">Performance of surgeons</td>
                        </tr>
                        <tr>
                            <td class="column0 style3 s style4" rowspan="2">Name Of Surgeon</td>
                            <td class="column1 style3 s style4" rowspan="2">Surgeon's Mobile Number</td>
                            <td class="column2 style3 s style4" rowspan="2">No of Operations</td>
                            <td class="column3 style3 s style4" rowspan="2">Facilities</td>
                            <td class="column4 style3 s style4" rowspan="2">Districts</td></tr>
                        <tr></tr>
                        <tr class="row2">
                            <td class="column5">&nbsp;</td>
                            <td class="column6">&nbsp;</td>
                            <td class="column7">&nbsp;</td>
                            <td class="column8">&nbsp;</td>
                            <td class="column9">&nbsp;</td>

                        </tr>
                    </tbody>
                </table>
            </div>



            <div style={{ marginTop: '3%', marginBottom: '3%' }}>
                <table border="0" cellpadding="0" cellspacing="0" id="sheet0" class="sheet0 gridlines">

                    <tbody>
                        <tr>
                            <td class="column0 style1 s">Performance of institutes</td>
                        </tr>
                        <tr>
                            <td class="column0 style3 s style4" rowspan="2">Facility/PHC</td>
                            <td class="column1 style3 s style4" rowspan="2">No of Operations</td>
                            <td class="column2 style3 s style4" rowspan="2">No of  Surgeons</td>
                            <td class="column3 style3 s style4" rowspan="2">Surgeon Names</td>
                            <td class="column4 style3 s style4" rowspan="2">Districts</td></tr>
                        <tr></tr>
                        <tr class="row2">
                            <td class="column5">&nbsp;</td>
                            <td class="column6">&nbsp;</td>
                            <td class="column7">&nbsp;</td>
                            <td class="column8">&nbsp;</td>
                            <td class="column9">&nbsp;</td>

                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '3%', marginBottom: '3%' }}>
                <table border="0" cellpadding="0" cellspacing="0" id="sheet0" class="sheet0 gridlines">

                    <tbody>
                        <tr>
                            <td class="column0 style1 s">MMDP activity reporting</td>

                        </tr>
                        <tr>
                            <td class="column0 style3 s style6" rowspan="2">Name Of Patient</td>
                            <td class="column1 style3 s style6" rowspan="2">Patient ID</td>
                            <td class="column2 style3 s style6" rowspan="2">Gender</td>
                            <td class="column3 style3 s style6" rowspan="2">District</td>
                            <td class="column4 style3 s style6" rowspan="2">Corporation</td>
                            <td class="column5 style3 s style6" rowspan="2">Taluka</td>
                            <td class="column6 style3 s style6" rowspan="2">Zone</td>
                            <td class="column7 style3 s style6" rowspan="2">Ward</td>
                            <td class="column8 style3 s style6" rowspan="2">Village</td>
                            <td class="column9 style3 s style6" rowspan="2">Facility/PHC</td>
                            <td class="column10 style3 s style6" rowspan="2">Year</td>
                            <td class="column11 style3 s style6" rowspan="2">Month</td>
                            <td class="column12 style3 s style6" rowspan="2">Age</td>
                            <td class="column13 style3 s style6" rowspan="2">Mobile No</td>
                            <td class="column14 style3 s style6" rowspan="2">Adress</td>
                            <td class="column15 style3 s style6" rowspan="2">Desese Type </td>
                            <td class="column16 style4 s style4" colspan="4">Details of Service Provider</td>
                            <td class="column20 style5 s style5" colspan="5">Follow Up</td>
                        </tr>
                        <tr>
                            <td class="column16 style7 s">Name</td>
                            <td class="column17 style7 s">Designation</td>
                            <td class="column18 style7 s">Place Of Service Given</td>
                            <td class="column19 style7 s">Phone Number</td>
                            <td class="column20 style7 s">Date Of Visit</td>
                            <td class="column21 style7 s">MMDP Training Given On</td>
                            <td class="column22 style7 s">MM Followed On</td>
                            <td class="column23 style7 s">MMDP Kit Given On</td>
                            <td class="column24 style7 s">Medicine Given On</td>
                        </tr>
                        <tr>
                            <td class="column5">&nbsp;</td>
                            <td class="column6">&nbsp;</td>
                            <td class="column7">&nbsp;</td>
                            <td class="column8">&nbsp;</td>
                            <td class="column9">&nbsp;</td>  <td class="column5">&nbsp;</td>
                            <td class="column6">&nbsp;</td>
                            <td class="column7">&nbsp;</td>
                            <td class="column8">&nbsp;</td>
                            <td class="column9">&nbsp;</td>  <td class="column5">&nbsp;</td>
                            <td class="column6">&nbsp;</td>
                            <td class="column7">&nbsp;</td>
                            <td class="column8">&nbsp;</td>
                            <td class="column9">&nbsp;</td>  <td class="column5">&nbsp;</td>
                            <td class="column6">&nbsp;</td>
                            <td class="column7">&nbsp;</td>
                            <td class="column8">&nbsp;</td>
                            <td class="column9">&nbsp;</td>  <td class="column5">&nbsp;</td>
                            <td class="column6">&nbsp;</td>
                            <td class="column7">&nbsp;</td>
                            <td class="column8">&nbsp;</td>
                            <td class="column9">&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default AnalysisLymphedemaLinelist;