document.addEventListener("DOMContentLoaded", () => {
  const categoryConfig = [
    { name: "BUNDLE" },
    { name: "CONTROLLER" },
    { name: "MOTOR CONTROLLER" },
    { name: "JOY STICK" },
    { name: "BATTERY" },
    { name: "SENSOR", sub: ["ANALOG", "DIGITAL", "IIC", "UART"] },
    { name: "MOTOR", sub: ["SERVO", "TT", "DC"] },
    { name: "BRACKET & ACCESSORY" },
    { name: "L SHAPED BEAM" },
    { name: "C SHAPED BEAM" },
    { name: "FLAT BEAM" },
    { name: "BEAM JOINER" },
    { name: "GUSSET PLATE" },
    { name: "SPECIAL PLATE" },
    { name: "FLANGED PLATE" },
    { name: "D SHAFT" },
    { name: "JOINER & COLLAR" },
    { name: "HUB" },
    { name: "BEARING TUBE" },
    { name: "GEAR" },
    { name: "CHAIN KIT" },
    { name: "SYNCHRONOUS WHEEL" },
    { name: "LINEAR SLIDE" },
    { name: "LEADSCREW" },
    { name: "WHEEL" },
    { name: "SCREW" },
    { name: "NUT" },
    { name: "WASHER & SPACER" },
  ];

  const productData = [
  // BUNDLE
  { code:"MAFI900V2", name:"WRO Future Innovators Set V2", category:"BUNDLE", price:20000, weight:200 },
  { code:"MA300", name:"MATRIX R4 Robo Set", category:"BUNDLE", price:11000, weight:200 },
  { code:"MA321", name:"MATRIX MissionGo Set", category:"BUNDLE", price:10000, weight:200 },
  { code:"MAMR120", name:"MATRIX AMR Set", category:"BUNDLE", price:22000, weight:200 },
  { code:"MR0001V2", name:"MATRIX Mini Essential Kit V2", category:"BUNDLE", price:6500, weight:200 },
  { code:"MR3000", name:"MATRIX Mini Innovation Kit", category:"BUNDLE", price:6000, weight:200 },
  { code:"MR120", name:"MATRIX Mini Starter Robot Kit 2.0", category:"BUNDLE", price:8000, weight:200 },
  { code:"MX120", name:"MX120 Expansion Set", category:"BUNDLE", price:6000, weight:200 },
  { code:"WSC-2026", name:"2026 WSC 競賽套組", category:"BUNDLE", price:45000, weight:200 },
  { code:"KNR-RS021910", name:"KNR Robotics Set", category:"BUNDLE", price:70000, weight:200 },
  { code:"MMX12-000-CBM", name:"MATRIX Motor Controller - 12V Set with CAN Bus Module", category:"BUNDLE", price:1600, weight:200 },

  // CONTROLLER
  { code:"MMJ-000", name:"MATRIX Micro Junior Controller", category:"CONTROLLER", price:0, weight:200 },
  { code:"MM-000 V2", name:"MATRIX Micro Controller V2", category:"CONTROLLER", price:0, weight:200 },
  { code:"MR-000 V2-4", name:"MATRIX Mini Controller V2.4", category:"CONTROLLER", price:1450, weight:200 },
  { code:"MA-000", name:"MATRIX Mini R4 Controller", category:"CONTROLLER", price:6000, weight:200 },
  { code:"KNR-MBS0214", name:"KNRm Controller", category:"CONTROLLER", price:49493, weight:200, eol:true },

  // MOTOR CONTROLLER
  { code:"NEW14-0003", name:"MATRIX Motor Controller - 12V", category:"MOTOR CONTROLLER", price:0, weight:200 },
  { code:"14-0003", name:"MATRIX Motor Controller - 9V", category:"MOTOR CONTROLLER", price:0, weight:200, eol:true },

  // JOY STICK
  { code:"MJ2", name:"MATRIX JOYSTICK II", category:"JOY STICK", price:1500, weight:200 },

  // BATTERY
  { code:"18650-HD", name:"18650x2 Battery Box", category:"BATTERY", price:65, weight:200 },
  { code:"5521DC-06V2", name:"6 Cell AA Battery Box", category:"BATTERY", price:0, weight:200 },
  { code:"14-0004", name:"Battery 9.6V SC2400mAH", category:"BATTERY", price:0, weight:200 },

  // SENSOR → ANALOG
  { code:"MS-003V2", name:"MATRIX Grayscale Sensor V2", category:"SENSOR", subCategory:"ANALOG", price:250, weight:200, eol:true },
  { code:"MS-003V3", name:"MATRIX Grayscale Sensor V3", category:"SENSOR", subCategory:"ANALOG", price:150, weight:200 },
  { code:"MS-013", name:"MATRIX Potentiometer Sensor", category:"SENSOR", subCategory:"ANALOG", price:200, weight:200 },
  { code:"MS-014", name:"MATRIX Water Level Sensor", category:"SENSOR", subCategory:"ANALOG", price:150, weight:200 },
  { code:"MS-016", name:"MATRIX Soil Moister Sensor", category:"SENSOR", subCategory:"ANALOG", price:200, weight:200 },
  { code:"28995", name:"IR Range Sensor (10cm to 80cm)", category:"SENSOR", subCategory:"ANALOG", price:0, weight:200, eol:true },

  // SENSOR → DIGITAL
  { code:"MS-004V2", name:"MATRIX Miniature Switch V2", category:"SENSOR", subCategory:"DIGITAL", price:250, weight:200, eol:true },
  { code:"MS-004V3", name:"MATRIX Miniature Switch V3", category:"SENSOR", subCategory:"DIGITAL", price:250, weight:200 },
  { code:"MS-001", name:"MATRIX Motion Sensor", category:"SENSOR", subCategory:"DIGITAL", price:0, weight:200 },
  { code:"MS-011", name:"MATRIX Temperature & Humidity Sensor", category:"SENSOR", subCategory:"DIGITAL", price:200, weight:200 },
  { code:"MS-012", name:"MATRIX PIR Motion Sensor", category:"SENSOR", subCategory:"DIGITAL", price:200, weight:200 },
  { code:"MS-015", name:"MATRIX One Wire Temperature Sensor", category:"SENSOR", subCategory:"DIGITAL", price:200, weight:200 },
  { code:"28015", name:"PING Ultrasonic Distance Sensor", category:"SENSOR", subCategory:"DIGITAL", price:0, weight:200, eol:true },

  // SENSOR → IIC
  { code:"MS-002V2", name:"MATRIX Color Sensor V2", category:"SENSOR", subCategory:"IIC", price:650, weight:200, eol:true },
  { code:"MS-002V3", name:"MATRIX Color Sensor V3", category:"SENSOR", subCategory:"IIC", price:600, weight:200 },
  { code:"MS-009", name:"MATRIX Laser Sensor", category:"SENSOR", subCategory:"IIC", price:650, weight:200, eol:true },
  { code:"MS-009V2", name:"MATRIX Laser Sensor V2", category:"SENSOR", subCategory:"IIC", price:600, weight:200 },
  { code:"MS-017", name:"MATRIX Gesture Sensor", category:"SENSOR", subCategory:"IIC", price:600, weight:200 },
  { code:"BNO055", name:"BNO055 Absolute Orientation IMU", category:"SENSOR", subCategory:"IIC", price:0, weight:200, eol:true },
  { code:"MS-018V2-JST", name:"MATRIX Line Tracer 10CH Pack V2(JST)", category:"SENSOR", subCategory:"IIC", price:600, weight:200 },
  { code:"MS-018V2-RJ12", name:"MATRIX Line Tracer 10CH Pack V2(RJ12)", category:"SENSOR", subCategory:"IIC", price:600, weight:200 },

  // SENSOR → UART
  { code:"MS-010", name:"M-Vision AI Cam", category:"SENSOR", subCategory:"UART", price:3300, weight:200, eol:true },
  { code:"MS-010V2", name:"M-Vision AI Cam V2", category:"SENSOR", subCategory:"UART", price:3300, weight:200 },

  // MOTOR → SERVO
  { code:"MMRC-MG90S", name:"MATRIX Micro Servo (metal gear)", category:"MOTOR", subCategory:"SERVO", price:200, weight:200 },
  { code:"MRC-MG15-180", name:"MATRIX RC Servo (metal gear)", category:"MOTOR", subCategory:"SERVO", price:800, weight:200 },
  { code:"MRC-MG25-180", name:"MATRIX RC Servo (metal gear)", category:"MOTOR", subCategory:"SERVO", price:0, weight:200 },
  { code:"MRC-MG17-335", name:"MATRIX RC Servo (metal gear)", category:"MOTOR", subCategory:"SERVO", price:0, weight:200, eol:true },
  { code:"MRC-MG360S", name:"MATRIX RC Servo (metal gear)", category:"MOTOR", subCategory:"SERVO", price:0, weight:200, eol:true },
  { code:"MRC-MG996", name:"MATRIX RC Servo (metal gear)", category:"MOTOR", subCategory:"SERVO", price:400, weight:200, eol:true },
  { code:"MRC-MG6225-PDI", name:"MATRIX RC Servo (metal gear)", category:"MOTOR", subCategory:"SERVO", price:0, weight:200, eol:true },
  { code:"MRC-TB2-180", name:"MATRIX RC Servo with Technic Brick Form x2", category:"MOTOR", subCategory:"SERVO", price:1150, weight:200 },

  // MOTOR → TT
  { code:"METB-SG001", name:"MATRIX TB Encoder Medium Motor", category:"MOTOR", subCategory:"TT", price:0, weight:200, eol:true },
  { code:"METT-MG001", name:"MATRIX TT Encoder Motor", category:"MOTOR", subCategory:"TT", price:0, weight:200 },
  { code:"MTT-MG001", name:"MATRIX TT Motor", category:"MOTOR", subCategory:"TT", price:400, weight:200 },
  { code:"MTT-SG001", name:"MATRIX TT Motor", category:"MOTOR", subCategory:"TT", price:400, weight:200 },

  // MOTOR → DC
  { code:"14-0001", name:"MATRIX 9V DC HS Motor", category:"MOTOR", subCategory:"DC", price:0, weight:200, eol:true },
  { code:"14-0009", name:"MATRIX 9V DC HT Motor", category:"MOTOR", subCategory:"DC", price:0, weight:200, eol:true },
  { code:"14-0011", name:"MATRIX Motor w/ Anderson Powerpole", category:"MOTOR", subCategory:"DC", price:0, weight:200, eol:true },
  { code:"14-0015", name:"MATRIX Motor w/ 6mm D Shaft", category:"MOTOR", subCategory:"DC", price:0, weight:200, eol:true },

  // BRACKET & ACCESSORY
  { code:"07-0001", name:"Micro Servo Bracket", category:"BRACKET & ACCESSORY", price:120, weight:200 },
  { code:"07-0002", name:"Servo Bracket", category:"BRACKET & ACCESSORY", price:0, weight:200, eol:true },
  { code:"07-0009", name:"RC Servo Bracket", category:"BRACKET & ACCESSORY", price:50, weight:200 },
  { code:"07-0005", name:"DC Motor Double Flanged Bracket - 5 x 7 Hole", category:"BRACKET & ACCESSORY", price:50, weight:200 },
  { code:"07-0010", name:"DC Motor Hub Bracket (EOL)", category:"BRACKET & ACCESSORY", price:0, weight:200, eol:true },
  { code:"07-0011", name:"DC Motor Hub Bracket", category:"BRACKET & ACCESSORY", price:220, weight:200 },
  { code:"07-2331", name:"DC Motor Double Flanged Bracket - 23 x 31 Hole", category:"BRACKET & ACCESSORY", price:400, weight:200 },
  { code:"07-AM3103", name:"DC Motor Double Flanged Bracket – am3103", category:"BRACKET & ACCESSORY", price:0, weight:200, eol:true },
  { code:"07-AM3637", name:"DC Motor Double Flanged Bracket – am3637", category:"BRACKET & ACCESSORY", price:0, weight:200, eol:true },
  { code:"07-0004", name:"Servo Bearing Beam - 5 Hole", category:"BRACKET & ACCESSORY", price:50, weight:200 },
  { code:"07-0006", name:"Servo Horn Wheel Brace - Short", category:"BRACKET & ACCESSORY", price:50, weight:200 },
  { code:"07-0007", name:"Servo Horn Wheel Brace - Long", category:"BRACKET & ACCESSORY", price:50, weight:200 },
  { code:"07-0008", name:"TT Motor Bracket (Set of Left and Right)", category:"BRACKET & ACCESSORY", price:150, weight:200 },
  { code:"13-0012", name:"Micro Servo Horn Wheel", category:"BRACKET & ACCESSORY", price:45, weight:200 },
  { code:"13-0002", name:"RC Servo Horn Wheel", category:"BRACKET & ACCESSORY", price:285, weight:200 },

  // L SHAPED BEAM
  { code:"01-0003", name:"L Shaped Beam - 3 Hole", category:"L SHAPED BEAM", price:180, weight:200 },
  { code:"01-0005", name:"L Shaped Beam - 5 Hole", category:"L SHAPED BEAM", price:200, weight:200 },
  { code:"01-0007", name:"L Shaped Beam - 7 Hole", category:"L SHAPED BEAM", price:220, weight:200 },
  { code:"01-0009", name:"L Shaped Beam - 9 Hole", category:"L SHAPED BEAM", price:240, weight:200 },
  { code:"01-0021", name:"L Shaped Beam - 21 Hole", category:"L SHAPED BEAM", price:400, weight:200 },
  { code:"01-0029", name:"L Shaped Beam - 29 Hole", category:"L SHAPED BEAM", price:500, weight:200 },
  { code:"01-0037", name:"L Shaped Beam - 37 Hole", category:"L SHAPED BEAM", price:600, weight:200 },
  { code:"01-0313", name:"L Shaped Beam XL - 13 Hole", category:"L SHAPED BEAM", price:500, weight:200 },
  { code:"01-0317", name:"L Shaped Beam XL - 17 Hole", category:"L SHAPED BEAM", price:550, weight:200 },
  { code:"01-0321", name:"L Shaped Beam XL - 21 Hole", category:"L SHAPED BEAM", price:700, weight:200 },
  { code:"01-0329", name:"L Shaped Beam XL - 29 Hole", category:"L SHAPED BEAM", price:900, weight:200 },
  { code:"01-0337", name:"L Shaped Beam XL - 37 Hole", category:"L SHAPED BEAM", price:950, weight:200 },
  { code:"01-0349", name:"L Shaped Beam XL - 49 Hole", category:"L SHAPED BEAM", price:1250, weight:200 },

  // FLAT BEAM
  { code:"02-0003", name:"Flat Beam - 3 Hole", category:"FLAT BEAM", price:140, weight:200 },
  { code:"02-0005", name:"Flat Beam - 5 Hole", category:"FLAT BEAM", price:160, weight:200 },
  { code:"02-0007", name:"Flat Beam - 7 Hole", category:"FLAT BEAM", price:180, weight:200 },
  { code:"02-0009", name:"Flat Beam - 9 Hole", category:"FLAT BEAM", price:200, weight:200 },
  { code:"02-0011", name:"Flat Beam - 11 Hole", category:"FLAT BEAM", price:220, weight:200 },

  // GUSSET PLATE
  { code:"04-0303", name:"Gusset Plate 3 x 3 Hole", category:"GUSSET PLATE", price:150, weight:200 },
  { code:"04-0305", name:"Gusset Plate 3 x 5 Hole", category:"GUSSET PLATE", price:180, weight:200 },
  { code:"04-0307", name:"Gusset Plate 3 x 7 Hole", category:"GUSSET PLATE", price:200, weight:200 },
  { code:"04-0309", name:"Gusset Plate 3 x 9 Hole", category:"GUSSET PLATE", price:220, weight:200 },
  { code:"04-0505", name:"Gusset Plate 5 x 5 Hole", category:"GUSSET PLATE", price:240, weight:200 },
  { code:"04-0921", name:"Gusset Plate 9 x 21 Hole", category:"GUSSET PLATE", price:800, weight:200 },

  // C SHAPED BEAM
  { code:"06-0005", name:"C Shaped Beam - 5 Hole", category:"C SHAPED BEAM", price:300, weight:200 },
  { code:"06-0009", name:"C Shaped Beam - 9 Hole", category:"C SHAPED BEAM", price:320, weight:200 },
  { code:"06-0013", name:"C Shaped Beam - 13 Hole", category:"C SHAPED BEAM", price:600, weight:200 },
  { code:"06-0017", name:"C Shaped Beam - 17 Hole", category:"C SHAPED BEAM", price:650, weight:200 },
  { code:"06-0021", name:"C Shaped Beam - 21 Hole", category:"C SHAPED BEAM", price:700, weight:200 },
  { code:"06-0029", name:"C Shaped Beam - 29 Hole", category:"C SHAPED BEAM", price:750, weight:200 },
  { code:"06-0037", name:"C Shaped Beam - 37 Hole", category:"C SHAPED BEAM", price:1100, weight:200 },
  { code:"06-0049", name:"C Shaped Beam - 49 Hole", category:"C SHAPED BEAM", price:1200, weight:200 },
  { code:"06-0339", name:"C Shaped Beam XL - 39 Hole", category:"C SHAPED BEAM", price:1300, weight:200 },
  { code:"06-0347", name:"C Shaped Beam XL - 47 Hole", category:"C SHAPED BEAM", price:1400, weight:200 },
  { code:"06-2232", name:"C Shaped Beam XL2 - 232mm", category:"C SHAPED BEAM", price:1500, weight:200 },
  { code:"06-2296", name:"C Shaped Beam XL2 - 296mm", category:"C SHAPED BEAM", price:1800, weight:200 },
  { code:"06-2424", name:"C Shaped Beam XL2 - 424mm", category:"C SHAPED BEAM", price:2000, weight:200 },
  { code:"06-2216", name:"C Shaped Beam XL2 - 216mm", category:"C SHAPED BEAM", price:0, weight:200, eol:true },
  { code:"06-2312", name:"C Shaped Beam XL2 - 312mm", category:"C SHAPED BEAM", price:0, weight:200, eol:true },
  { code:"06-2408", name:"C Shaped Beam XL2 - 408mm", category:"C SHAPED BEAM", price:0, weight:200, eol:true },

  // BEAM JOINER
  { code:"03-0001", name:"Beam Joiner - 1D Straight", category:"BEAM JOINER", price:280, weight:200 },
  { code:"03-0002", name:"Beam Joiner - 2D Right Angle", category:"BEAM JOINER", price:300, weight:200 },
  { code:"03-0003", name:"Beam Joiner - 3D Right Angle", category:"BEAM JOINER", price:320, weight:200 },
  { code:"03-0301", name:"Beam Joiner XL-1D Straight", category:"BEAM JOINER", price:350, weight:200 },
  { code:"03-0302", name:"Beam Joiner XL-2D Right Angle", category:"BEAM JOINER", price:500, weight:200 },
  { code:"03-0303", name:"Beam Joiner XL-3D Right Angle", category:"BEAM JOINER", price:800, weight:200 },

  // SPECIAL PLATE
  { code:"17-0709", name:"Triangle Plate 6-8-10 Hole", category:"SPECIAL PLATE", price:210, weight:200 },

  // FLANGED PLATE
  { code:"05-0303", name:"Flanged Plate 3 x 3 Hole", category:"FLANGED PLATE", price:200, weight:200 },
  { code:"05-0305", name:"Flanged Plate 3 x 5 Hole", category:"FLANGED PLATE", price:400, weight:200 },
  { code:"05-0307", name:"Flanged Plate 3 x 7 Hole", category:"FLANGED PLATE", price:215, weight:200 },
  { code:"05-0309", name:"Flanged Plate 3 x 9 Hole", category:"FLANGED PLATE", price:275, weight:200 },

  // D SHAFT
  { code:"10-0028", name:"4mm D Shaft - 28mm", category:"D SHAFT", price:40, weight:200 },
  { code:"10-0052", name:"4mm D Shaft - 52mm", category:"D SHAFT", price:80, weight:200 },
  { code:"10-0080", name:"4mm D Shaft - 80mm", category:"D SHAFT", price:120, weight:200 },
  { code:"10-0132", name:"4mm D Shaft - 132mm", category:"D SHAFT", price:180, weight:200 },
  { code:"10-0160", name:"4mm D Shaft - 160mm", category:"D SHAFT", price:220, weight:200 },
  { code:"10-0164", name:"4mm D Shaft - 164mm", category:"D SHAFT", price:220, weight:200 },
  { code:"10-0280", name:"4mm D Shaft - 280mm", category:"D SHAFT", price:400, weight:200 },
  { code:"10-6030", name:"6mm D Shaft - 30mm", category:"D SHAFT", price:400, weight:200 },
  { code:"10-6050", name:"6mm D Shaft - 50mm", category:"D SHAFT", price:700, weight:200 },
  { code:"10-6080", name:"6mm D Shaft - 80mm", category:"D SHAFT", price:1000, weight:200 },
  { code:"10-6160", name:"6mm D Shaft - 160mm", category:"D SHAFT", price:1500, weight:200 },
  { code:"10-6300", name:"6mm D Shaft - 300mm", category:"D SHAFT", price:2000, weight:200 },

  // JOINER & COLLAR
  { code:"08-0019", name:"4mm Axle Collar with M4 set screw", category:"JOINER & COLLAR", price:120, weight:200 },
  { code:"08-0021", name:"4mm to 4mm Coupling with M4 set screw", category:"JOINER & COLLAR", price:120, weight:200 },
  { code:"08-0020", name:"4mm to 6mm Adaptor with M4 set screw", category:"JOINER & COLLAR", price:120, weight:200 },
  { code:"08-0031", name:"4mm to TT Adapter with M4 set screw", category:"JOINER & COLLAR", price:0, weight:200, eol:true },
  { code:"08-0037", name:"4mm to TT Adapter with M4 set screw", category:"JOINER & COLLAR", price:250, weight:200 },
  { code:"08-0032", name:"6mm Axle Collar with M4 set screw", category:"JOINER & COLLAR", price:120, weight:200 },
  { code:"08-0033", name:"6mm to 6mm Coupling with M4 set screw", category:"JOINER & COLLAR", price:200, weight:200 },
  { code:"09-0004", name:"4mm Joiner Block with M3 set screw", category:"JOINER & COLLAR", price:500, weight:200 },

  // HUB
  { code:"08-0006", name:"4mm Omni Flat Wheel Nut", category:"HUB", price:120, weight:200 },
  { code:"08-0024", name:"4mm Omni Thin Wheel with M4 set screw", category:"HUB", price:350, weight:200 },
  { code:"08-0007", name:"4mm Hub with M4 set screw", category:"HUB", price:350, weight:200 },
  { code:"08-0014", name:"6mm Omni Flat Wheel Nut", category:"HUB", price:120, weight:200 },
  { code:"08-0013", name:"6mm Omni Thin Wheel with M4 set screw", category:"HUB", price:350, weight:200 },
  { code:"08-0008", name:"6mm Hub with M4 set screw", category:"HUB", price:350, weight:200 },
  { code:"08-0039", name:"6mm Flanged Ball Bearing", category:"HUB", price:1800, weight:200 },

  // BEARING TUBE
  { code:"08-0015", name:"4mm Bearing Tube - 15mm", category:"BEARING TUBE", price:120, weight:200 },
  { code:"08-0030", name:"4mm Bearing Tube - 30mm", category:"BEARING TUBE", price:200, weight:200 },
  { code:"08-0018", name:"6mm Bearing Tube - 15mm", category:"BEARING TUBE", price:120, weight:200 },
  { code:"08-0017", name:"6mm Bearing Tube - 30mm", category:"BEARING TUBE", price:150, weight:200 },

  // GEAR
  { code:"12-0024", name:"Gear - 24 Tooth with M4 set screw", category:"GEAR", price:900, weight:200 },
  { code:"12-0040", name:"Gear - 40 Tooth with M4 set screw", category:"GEAR", price:1200, weight:200 },
  { code:"12-0056", name:"Gear - 56 Tooth with M4 set screw", category:"GEAR", price:1500, weight:200 },
  { code:"13-0024", name:"Metal Gear - 24 Tooth", category:"GEAR", price:800, weight:200 },
  { code:"13-0040", name:"Metal Gear - 40 Tooth", category:"GEAR", price:900, weight:200 },
  { code:"13-0056", name:"Metal Gear - 56 Tooth", category:"GEAR", price:1500, weight:200 },
  { code:"13-0104", name:"Metal Gear - 104 Tooth", category:"GEAR", price:2500, weight:200 },

  // CHAIN KIT
  { code:"25-1X240", name:"Roller Chain 25 x 240 Link", category:"CHAIN KIT", price:620, weight:200, eol:true },
  { code:"25-1X480", name:"Roller Chain 25 x 480 Link", category:"CHAIN KIT", price:1000, weight:200 },
  { code:"A025016", name:"25A Chain Gear - 16 Tooth", category:"CHAIN KIT", price:700, weight:200 },
  { code:"A025024", name:"25A Chain Gear - 24 Tooth", category:"CHAIN KIT", price:800, weight:200 },
  { code:"A025032", name:"25A Chain Gear - 32 Tooth", category:"CHAIN KIT", price:1000, weight:200 },

  // SYNCHRONOUS WHEEL
  { code:"2GT-20T", name:"2GT Synchronous Wheel - 20 Tooth", category:"SYNCHRONOUS WHEEL", price:0, weight:200 },
  { code:"2GT-36T", name:"2GT Synchronous Wheel - 36 Tooth", category:"SYNCHRONOUS WHEEL", price:300, weight:200 },
  { code:"2GT-48T", name:"2GT Synchronous Wheel - 48 Tooth", category:"SYNCHRONOUS WHEEL", price:0, weight:200 },
  { code:"2GT-172-6", name:"2GT Synchronous Belt - 172 x 6mm", category:"SYNCHRONOUS WHEEL", price:0, weight:200 },
  { code:"2GT-852-6", name:"2GT Synchronous Belt - 852 x 6mm", category:"SYNCHRONOUS WHEEL", price:300, weight:200 },

  // LINEAR SLIDE
  { code:"12-0001", name:"Tooth Belt -7 Hole", category:"LINEAR SLIDE", price:200, weight:200 },
  { code:"12-0002", name:"Linear Slide - 3 Hole", category:"LINEAR SLIDE", price:250, weight:200 },
  { code:"MGN09H", name:"HIWIN Miniature Guides MGN HIRES Series", category:"LINEAR SLIDE", price:3275, weight:200 },
  { code:"MGN15H", name:"HIWIN Miniature Guides MGN HIRES Series", category:"LINEAR SLIDE", price:4545, weight:200 },

  // LEADSCREW
  { code:"18-0128", name:"Leadscrew - 128mm", category:"LEADSCREW", price:500, weight:200 },
  { code:"18-0256", name:"Leadscrew - 256mm", category:"LEADSCREW", price:600, weight:200 },
  { code:"18-0001", name:"Leadscrew Block", category:"LEADSCREW", price:150, weight:200 },

  // WHEEL
  { code:"13-0003", name:"Caster Wheel - 48mm", category:"WHEEL", price:100, weight:200 },
  { code:"13-0001", name:"Wheel - 96mm with M3 set screw", category:"WHEEL", price:900, weight:200 },
  { code:"13-0009", name:"Wide Wheel - 79mm", category:"WHEEL", price:0, weight:200 },
  { code:"13-0008", name:"Single Omni Wheel - 94mm", category:"WHEEL", price:400, weight:200 },
  { code:"16-0001", name:"4mm Double Omni Wheel - 94mm", category:"WHEEL", price:0, weight:200 },
  { code:"16-0002", name:"6mm Double Omni Wheel - 94mm", category:"WHEEL", price:800, weight:200 },
  { code:"13-0013", name:"6mm Mecanum Wheel - 100mm", category:"WHEEL", price:500, weight:200 },
  { code:"13-0014", name:"6mm Mecanum Wheel - 203mm", category:"WHEEL", price:6000, weight:200 },
  { code:"13-0015", name:"6mm Plastic Mecanum Wheel - 100mm", category:"WHEEL", price:2800, weight:200 },
  { code:"TT-TIRE_OR", name:"MATRIX TT Wheel (Off-Road)", category:"WHEEL", price:50, weight:200 },
  { code:"TT-TIRE_B", name:"MATRIX TT Wheel (Blue Rim)", category:"WHEEL", price:50, weight:200 },
  { code:"13-0010", name:"MATRIX Steel Ball Caster", category:"WHEEL", price:20, weight:200 },

  // SCREW
  { code:"11-3104", name:"M3 Button Head Screw - 4mm", category:"SCREW", price:0, weight:200 },
  { code:"11-3106", name:"M3 Button Head Screw - 6mm", category:"SCREW", price:0, weight:200 },
  { code:"11-3204", name:"M3 Flat Point set screw - 4.5mm", category:"SCREW", price:0, weight:200 },
  { code:"11-3404", name:"M4 Flat Point set screw - 4mm", category:"SCREW", price:100, weight:200 },
  { code:"11-3608", name:"M3 Cylinder Head Screw - 8mm", category:"SCREW", price:0, weight:200, eol:true },
  { code:"11-4108", name:"M4 Button Head Screw - 8mm", category:"SCREW", price:400, weight:200 },
  { code:"11-4112", name:"M4 Button Head Screw - 12mm", category:"SCREW", price:200, weight:200 },
  { code:"11-4116", name:"M4 Button Head Screw - 16mm", category:"SCREW", price:200, weight:200 },
  { code:"11-4120", name:"M4 Button Head Screw - 20mm", category:"SCREW", price:500, weight:200 },
  { code:"11-4124", name:"M4 Button Head Screw - 24mm", category:"SCREW", price:300, weight:200 },
  { code:"11-4140", name:"M4 Button Head Screw - 40mm", category:"SCREW", price:400, weight:200 },
  { code:"11-4604", name:"M4 Cylinder Head Screw - 4mm", category:"SCREW", price:0, weight:200, eol:true },

  // NUT
  { code:"11-4501", name:"M4 Hex Nut", category:"NUT", price:100, weight:200 },
  { code:"11-4502", name:"M4 Hex Nut with Tooth Washer", category:"NUT", price:200, weight:200 },
  { code:"11-4503", name:"M4 Hex Nut with Nylon Lock", category:"NUT", price:600, weight:200 },
  { code:"11-6000", name:"MATRIX Quick Connector – Battery Box", category:"NUT", price:125, weight:200 },
  { code:"11-6050", name:"MATRIX Quick Connector - 5mm", category:"NUT", price:125, weight:200 },
  { code:"11-6070", name:"MATRIX Quick Connector - 7mm", category:"NUT", price:125, weight:200 },
  { code:"11-6120", name:"MATRIX Quick Connector - 12mm", category:"NUT", price:125, weight:200 },
  { code:"11-7050", name:"MATRIX Quick Connector - TB Link", category:"NUT", price:125, weight:200 },

  // WASHER / SPACER
  { code:"11-4402", name:"M4 Nylon Washer", category:"WASHER & SPACER", price:200, weight:200 },
  { code:"11-4403", name:"M4 Nylon Shoulder Washer", category:"WASHER & SPACER", price:200, weight:200 },
  { code:"09-0003", name:"M4 Standoff Spacer - 16mm", category:"WASHER & SPACER", price:100, weight:200 },
  { code:"09-0001", name:"M4 Standoff Spacer - 32mm", category:"WASHER & SPACER", price:200, weight:200 },
  { code:"13-0005", name:"Spacer -4mm", category:"WASHER & SPACER", price:0, weight:200 },
  { code:"13-0004", name:"Spacer - 48mm", category:"WASHER & SPACER", price:0, weight:200 },
  ];

  // MOQ 設定 (最低購買量)
  const MOQ_MAP = {
    // SCREW & NUT (bag/pack 銷售)
    "11-3104": 100, "11-3106": 100, "11-3204": 100, "11-3404": 100,
    "11-3608": 100, "11-4108": 100, "11-4112": 100, "11-4116": 100,
    "11-4120": 100, "11-4124": 100, "11-4140": 100, "11-4604": 100,
    "11-4501": 100, "11-4502": 100, "11-4503": 100,
    "11-4402": 100, "11-4403": 100,
    // Quick Connector (20pcs/bag)
    "11-6000": 20, "11-6050": 20, "11-6070": 20, "11-6120": 20, "11-7050": 20,
    // Spacer
    "13-0005": 10, "13-0004": 10,
    // TT Wheel
    "TT-TIRE_OR": 2, "TT-TIRE_B": 2,
    // Bearing Tube
    "08-0015": 2, "08-0030": 2, "08-0018": 2, "08-0017": 2,
  };

  productData.forEach(p => {
    p.qty = 0;
    p.moq = MOQ_MAP[p.code] || 1;
  });

  // ─── DOM refs ────────────────────────────────────────────────
  const sidebar       = document.getElementById("sidebar-menu");
  const content       = document.getElementById("content-area");
  const cartFab       = document.getElementById("cart-fab");
  const cartCount     = document.getElementById("cart-count");
  const selectedPanel = document.getElementById("selected-panel");
  const selectedList  = document.getElementById("selected-list");
  const cartOverlay   = document.getElementById("cart-overlay");
  const panelClose    = document.getElementById("panel-close");
  const cartSubtotal  = document.getElementById("cart-subtotal");
  const cartShipping  = document.getElementById("cart-shipping");
  const cartTotal     = document.getElementById("cart-total");

  // ─── Routing state ──────────────────────────────────────────
  // Remembers the last category/subcategory shown so we can return to it
  // from a product detail page or after a hash route falls back to default.
  let lastCategory  = "BUNDLE";
  let lastMobileAll = false;

  // ─── Helpers ─────────────────────────────────────────────────
  const formatMoney = n => Number(n || 0).toLocaleString("en-US");

  function getSelected()    { return productData.filter(p => p.qty > 0); }
  function getSubtotal()    { return getSelected().reduce((s, p) => s + p.price * p.qty, 0); }
  function getTotalWeight() { return getSelected().reduce((s, p) => s + p.weight * p.qty, 0); }

  // ─── DHL Express Easy 2026 費率表 (含燃油附加費及5%營業稅, NT$) ───
  const DHL_RATES = {
    zone1: [
      { maxWeight:  500, price:  599 },
      { maxWeight: 1500, price: 1649 },
      { maxWeight: 2500, price: 2449 },
      { maxWeight: 5000, price: 3499 },
      { maxWeight:10000, price: 3999 },
      { maxWeight:15000, price: 5249 },
      { maxWeight:20000, price: 5499 },
      { maxWeight:25000, price: 6499 },
    ],
    zone2: [
      { maxWeight:  500, price:  649 },
      { maxWeight: 1500, price: 1749 },
      { maxWeight: 2500, price: 2549 },
      { maxWeight: 5000, price: 3649 },
      { maxWeight:10000, price: 4399 },
      { maxWeight:15000, price: 5399 },
      { maxWeight:20000, price: 5999 },
      { maxWeight:25000, price: 6799 },
    ],
    zone3: [
      { maxWeight:  500, price:  699 },
      { maxWeight: 1500, price: 1849 },
      { maxWeight: 2500, price: 2649 },
      { maxWeight: 5000, price: 3799 },
      { maxWeight:10000, price: 4799 },
      { maxWeight:15000, price: 5449 },
      { maxWeight:20000, price: 6299 },
      { maxWeight:25000, price: 7199 },
    ],
    zone4: [
      { maxWeight:  500, price:  749 },
      { maxWeight: 1500, price: 1949 },
      { maxWeight: 2500, price: 2749 },
      { maxWeight: 5000, price: 3999 },
      { maxWeight:10000, price: 5249 },
      { maxWeight:15000, price: 5799 },
      { maxWeight:20000, price: 6959 },
      { maxWeight:25000, price: 8199 },
    ],
    zone5: [
      { maxWeight:  500, price:  999 },
      { maxWeight: 1500, price: 2499 },
      { maxWeight: 2500, price: 3399 },
      { maxWeight: 5000, price: 4999 },
      { maxWeight:10000, price: 6649 },
      { maxWeight:15000, price: 8649 },
      { maxWeight:20000, price:10399 },
      { maxWeight:25000, price:12499 },
    ],
    zone6: [
      { maxWeight:  500, price: 1449 },
      { maxWeight: 1500, price: 3399 },
      { maxWeight: 2500, price: 4199 },
      { maxWeight: 5000, price: 7899 },
      { maxWeight:10000, price:12899 },
      { maxWeight:15000, price:13999 },
      { maxWeight:20000, price:15299 },
      { maxWeight:25000, price:18999 },
    ],
  };

  function calcDHLShipping(zone, weightGram) {
    const table = DHL_RATES[zone];
    if (!table) return 0;
    const tier = table.find(t => weightGram <= t.maxWeight);
    return tier ? tier.price : table[table.length - 1].price;
  }

  function calcShipping(method, weight, zone) {
    if (method === "pickup") return 0;
    if (method === "taiwan") return 150;
    if (method === "international") return calcDHLShipping(zone || "zone5", weight);
    return 0;
  }

  // ─── Sidebar ─────────────────────────────────────────────────
  categoryConfig.forEach(cat => {
    const li = document.createElement("li");
    const a  = document.createElement("a");
    a.textContent = cat.name;
    a.dataset.cat = cat.name;
    li.appendChild(a);

    if (cat.sub) {
      const ul = document.createElement("ul");
      cat.sub.forEach(sub => {
        const subLi = document.createElement("li");
        const subA  = document.createElement("a");
        subA.textContent = sub;
        subA.dataset.cat = cat.name;
        subA.dataset.sub = sub;
        subLi.appendChild(subA);
        ul.appendChild(subLi);
      });
      li.appendChild(ul);
    }

    sidebar.appendChild(li);
  });

  // Highlights the sidebar entry matching a category/subcategory key
  // (used when returning from a product detail page or on initial load).
  function highlightSidebarFor(key) {
    sidebar.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    const link = sidebar.querySelector(`a[data-sub="${key}"]`) || sidebar.querySelector(`a[data-cat="${key}"]`);
    if (!link) return;
    link.parentNode.classList.add("active");
    if (link.dataset.sub) {
      const parentLi = link.parentNode.parentNode.parentNode;
      if (parentLi && parentLi.tagName === "LI") parentLi.classList.add("active");
    }
  }

  sidebar.addEventListener("click", e => {
    if (e.target.tagName !== "A") return;

    // Clear any product-detail hash quietly (no hashchange re-render) so
    // the back button doesn't loop back into the detail page we're leaving.
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);

    const clickedLi  = e.target.parentNode;
    const isMobile   = window.innerWidth <= 768;
    const isTopLevel = clickedLi.parentNode === sidebar;
    const hasSub     = clickedLi.querySelector("ul") !== null;
    const sub        = e.target.dataset.sub;
    const cat        = e.target.dataset.cat;

    sidebar.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    clickedLi.classList.add("active");

    // 手機版：點有子分類的父項目 → 直接顯示所有子分類產品，不展開 dropdown
    if (isMobile && isTopLevel && hasSub && !sub) {
      showSection(cat, true);
      return;
    }

    // 桌機版子分類：同時標記父 li active（保持 dropdown 展開）
    if (sub) {
      const parentLi = clickedLi.parentNode.parentNode;
      if (parentLi && parentLi.tagName === "LI") parentLi.classList.add("active");
    }

    showSection(sub || cat, false);
  });

  // ─── Shared quantity control wiring ───────────────────────────
  // Wires up +/-/input behavior for a product against any set of DOM
  // elements — used by both the grid card and the detail page so MOQ
  // snapping and cart updates stay in one place.
  function attachQtyControl(p, { minus, input, plus }) {
    function applyMOQ(val) {
      let v = Math.floor(Number(val));
      if (isNaN(v) || v < 0) v = 0;
      if (v > 0 && v < p.moq) v = p.moq; // snap up to MOQ
      return v;
    }

    function setQty(v) {
      p.qty = v;
      input.value = v;
      updateCart();
    }

    plus.addEventListener("click", () => {
      const current = p.qty;
      setQty(current === 0 ? p.moq : current + 1); // first click → jump to MOQ
    });

    minus.addEventListener("click", () => {
      const current = p.qty;
      setQty(current <= p.moq ? 0 : current - 1); // drop to 0 (remove from cart)
    });

    input.addEventListener("change", () => {
      setQty(applyMOQ(input.value));
    });
  }

  // ─── CAD (STEP file) download ─────────────────────────────────
  // Each part's CAD file is expected at cad/<code>.step. Some existing
  // files in cad/ use a .STEP extension instead, so we try that as a
  // same-origin fallback before giving up. Requires the page to be
  // served over http(s) (e.g. Live Server / GitHub Pages) — fetch
  // cannot read local files when opened directly via file://.
  function attachStepDownload(p, { button, status }) {
    if (!button) return;

    async function tryFetch(path) {
      try {
        const res = await fetch(path);
        if (res.ok) return res.blob();
      } catch {
        // ignore — likely opened via file:// or genuinely missing
      }
      return null;
    }

    button.addEventListener("click", async () => {
      button.disabled = true;
      status.textContent = "";
      status.className = "step-status";

      const blob =
        (await tryFetch(`cad/${encodeURIComponent(p.code)}.step`)) ||
        (await tryFetch(`cad/${encodeURIComponent(p.code)}.STEP`));

      button.disabled = false;

      if (!blob) {
        status.textContent = "CAD file not available for this part.";
        status.className = "step-status error";
        return;
      }

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${p.code}.step`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    });
  }

  // ─── Product section ─────────────────────────────────────────
  function showSection(key, mobileAll = false) {
    content.innerHTML = "";
    lastCategory  = key;
    lastMobileAll = mobileAll;

    const catConfig  = categoryConfig.find(c => c.name === key);
    const hasSub     = catConfig && catConfig.sub && catConfig.sub.length > 0;
    const isSub      = categoryConfig.some(c => c.sub && c.sub.includes(key));

    let items;
    if (mobileAll && hasSub) {
      // 手機模式：直接列出所有子分類的產品，不分組
      items = productData.filter(p => p.category === key);
    } else if (isSub) {
      items = productData.filter(p => p.subCategory === key);
    } else {
      items = productData.filter(p => p.category === key);
    }

    const section = document.createElement("div");
    section.className = "product-section";

    const header = document.createElement("div");
    header.className = "section-header";
    header.innerHTML = `
      <h2>${key}</h2>
      <span class="section-count">${items.length} items</span>
    `;
    section.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "product-grid";
    section.appendChild(grid);

    items.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card" + (p.eol ? " eol" : "");

      // Image area
      const imgWrap = document.createElement("div");
      imgWrap.className = "card-img-wrap";
      if (p.eol) {
        const eolBadge = document.createElement("span");
        eolBadge.className = "badge-eol";
        eolBadge.textContent = "EOL";
        imgWrap.appendChild(eolBadge);
      }
      if (p.price === 0 && !p.eol) {
        const naBadge = document.createElement("span");
        naBadge.className = "badge-na";
        naBadge.textContent = "INQUIRE";
        imgWrap.appendChild(naBadge);
      }
      const img = document.createElement("img");
      img.src = `img/${p.code}.png`;
      img.alt = p.code;
      img.onerror = function() { this.style.visibility = "hidden"; };
      imgWrap.appendChild(img);
      card.appendChild(imgWrap);

      // Card body
      const body = document.createElement("div");
      body.className = "card-body";

      const codeEl = document.createElement("div");
      codeEl.className = "product-code";
      codeEl.textContent = p.code;

      const nameEl = document.createElement("div");
      nameEl.className = "product-name";
      nameEl.textContent = p.name;

      const priceEl = document.createElement("div");
      priceEl.className = "product-price" + (p.price === 0 ? " na" : "");
      priceEl.textContent = p.price === 0 ? "Price on request" : `NT$${formatMoney(p.price)}`;

      const moqEl = document.createElement("div");
      moqEl.className = "moq-badge";
      moqEl.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> MOQ: ${p.moq}`;

      // Quantity control — built as real DOM elements so events work
      const qtyRow = document.createElement("div");
      qtyRow.className = "qty-row";

      const qtyCtrl = document.createElement("div");
      qtyCtrl.className = "quantity-control";

      const minusBtn = document.createElement("button");
      minusBtn.className = "minus";
      minusBtn.textContent = "−";
      minusBtn.type = "button";

      const qtyInput = document.createElement("input");
      qtyInput.type = "number";
      qtyInput.min = "0";
      qtyInput.value = p.qty;

      const plusBtn = document.createElement("button");
      plusBtn.className = "plus";
      plusBtn.textContent = "+";
      plusBtn.type = "button";

      qtyCtrl.appendChild(minusBtn);
      qtyCtrl.appendChild(qtyInput);
      qtyCtrl.appendChild(plusBtn);
      qtyRow.appendChild(qtyCtrl);

      body.appendChild(codeEl);
      body.appendChild(nameEl);
      body.appendChild(priceEl);
      body.appendChild(moqEl);
      body.appendChild(qtyRow);
      card.appendChild(body);
      grid.appendChild(card);

      attachQtyControl(p, { minus: minusBtn, input: qtyInput, plus: plusBtn });

      // Clicking the card (outside the qty controls) opens the detail page.
      card.addEventListener("click", e => {
        if (qtyRow.contains(e.target)) return;
        location.hash = `item/${encodeURIComponent(p.code)}`;
      });
    });

    content.appendChild(section);
  }

  // ─── Product detail page ──────────────────────────────────────
  // Renders a single product's detail view (image, price, MOQ, specs
  // table, qty control) into #content-area, addressed via #item/<code>.
  function showProductDetail(code) {
    const p = productData.find(prod => prod.code === code);
    if (!p) {
      showSection(lastCategory, lastMobileAll);
      highlightSidebarFor(lastCategory);
      return;
    }

    content.innerHTML = "";

    const specsEntries = p.specs ? Object.entries(p.specs) : [];
    const specsRows = specsEntries.length
      ? specsEntries.map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join("")
      : `<tr><td colspan="2" class="specs-empty">Specs coming soon.</td></tr>`;

    const detail = document.createElement("div");
    detail.className = "product-detail";
    detail.innerHTML = `
      <a href="#" class="detail-back-link">&larr; Back to ${lastCategory}</a>
      <div class="detail-main">
        <div class="detail-gallery">
          <div class="detail-img-wrap">
            <img src="img/${p.code}.png" alt="${p.code}" onerror="this.style.visibility='hidden'">
          </div>
          <div class="detail-img-wrap">
            <img src="img/PartPhoto.png" alt="${p.code} photo" onerror="this.style.visibility='hidden'">
          </div>
        </div>
        <div class="detail-info">
          <div class="product-code">${p.code}</div>
          <h1 class="detail-name">${p.name}</h1>
          <div class="product-price${p.price === 0 ? " na" : ""}">${p.price === 0 ? "Price on request" : `NT$${formatMoney(p.price)}`}</div>
          <div class="moq-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> MOQ: ${p.moq}</div>
          <div class="quantity-control detail-qty">
            <button type="button" class="minus">−</button>
            <input type="number" min="0" value="${p.qty}">
            <button type="button" class="plus">+</button>
          </div>
          <button type="button" class="step-download-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download STEP File
          </button>
          <div class="step-status"></div>
        </div>
      </div>
      <table class="specs-table">
        <tbody>${specsRows}</tbody>
      </table>
    `;
    content.appendChild(detail);

    attachQtyControl(p, {
      minus: detail.querySelector(".detail-qty .minus"),
      input: detail.querySelector(".detail-qty input"),
      plus:  detail.querySelector(".detail-qty .plus"),
    });

    attachStepDownload(p, {
      button: detail.querySelector(".step-download-btn"),
      status: detail.querySelector(".step-status"),
    });

    detail.querySelector(".detail-back-link").addEventListener("click", e => {
      e.preventDefault();
      history.replaceState(null, "", location.pathname + location.search);
      showSection(lastCategory, lastMobileAll);
      highlightSidebarFor(lastCategory);
    });
  }

  // ─── Cart update ─────────────────────────────────────────────
  function updateCart() {
    const selected = getSelected();
    let subtotal = 0;
    let count    = 0;

    selectedList.innerHTML = "";

    if (selected.length === 0) {
      selectedList.innerHTML = `
        <div class="empty-bag">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span>Your bag is empty</span>
        </div>`;
    }

    selected.forEach(p => {
      const itemSub = p.price * p.qty;
      subtotal += itemSub;
      count    += p.qty;

      const row = document.createElement("div");
      row.className = "selected-item";
      row.innerHTML = `
        <img class="selected-item-img" src="img/${p.code}.png" alt="${p.code}" onerror="this.style.visibility='hidden'">
        <div>
          <div class="sku">${p.code}</div>
          <div class="name">${p.name}</div>
          <div class="money">
            ${p.price === 0
              ? `${p.qty} × <span style="color:var(--text3)">Price on request</span>`
              : `${p.qty} × NT$${formatMoney(p.price)}&nbsp;=&nbsp;<span class="subtotal">NT$${formatMoney(itemSub)}</span>`
            }
          </div>
        </div>
      `;
      selectedList.appendChild(row);
    });

    cartCount.textContent    = count;
    cartSubtotal.textContent = formatMoney(subtotal);
    cartShipping.textContent = "Calculated at export";
    cartTotal.textContent    = formatMoney(subtotal);
  }

  // ─── Panel open / close ──────────────────────────────────────
  function openPanel() {
    selectedPanel.classList.add("open");
    cartOverlay.classList.add("open");
    updateCart();
  }
  function closePanel() {
    selectedPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
  }

  cartFab.addEventListener("click", () =>
    selectedPanel.classList.contains("open") ? closePanel() : openPanel()
  );
  if (panelClose) panelClose.addEventListener("click", closePanel);
  cartOverlay.addEventListener("click", closePanel);

  // ─── Export modal ────────────────────────────────────────────
  function showExportModal(cb) {
    const autoWeight = getTotalWeight();
    const m = document.createElement("div");
    m.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.4);
      display:flex;justify-content:center;align-items:center;
      z-index:1300;
    `;
    m.innerHTML = `
      <div style="
        background:#fff;padding:22px;border-radius:10px;
        width:340px;text-align:center;font-family:Microsoft JhengHei;
        max-height:90vh;overflow-y:auto;
      ">
        <h3 style="margin-bottom:16px;">Export Order</h3>
        <input id="order-name" placeholder="Name"
          style="width:90%;padding:8px;margin-bottom:10px;display:block;margin-inline:auto;">
        <textarea id="order-address" placeholder="Shipping Address"
          style="width:90%;height:70px;padding:8px;margin-bottom:10px;display:block;margin-inline:auto;"></textarea>

        <div style="width:90%;margin:0 auto 10px;text-align:left;">
          <label style="font-size:13px;color:#555;display:block;margin-bottom:4px;">Package Weight (g)</label>
          <input id="order-weight" type="number" min="1" max="25000" value="${autoWeight}"
            style="width:100%;padding:8px;box-sizing:border-box;">
          <div style="font-size:11px;color:#888;margin-top:3px;">
            Auto-calculated: ${autoWeight}g. You may adjust if needed.
          </div>
        </div>

        <select id="shipping-method" style="width:90%;padding:8px;margin-bottom:10px;display:block;margin-inline:auto;">
          <option value="pickup">Self Pickup - NT$0</option>
          <option value="taiwan">Taiwan Delivery - NT$150</option>
          <option value="international">International Delivery (DHL)</option>
        </select>

        <div id="zone-row" style="display:none;width:90%;margin:0 auto 10px;">
          <label style="font-size:13px;color:#555;display:block;margin-bottom:4px;text-align:left;">Destination Region</label>
          <select id="shipping-zone" style="width:100%;padding:8px;">
            <option value="zone1">Zone 1 — China / Hong Kong / Macau</option>
            <option value="zone2">Zone 2 — Japan / South Korea</option>
            <option value="zone3">Zone 3 — Singapore / Malaysia / Philippines / Thailand / Vietnam / Indonesia</option>
            <option value="zone4">Zone 4 — Other Asia / Australia / New Zealand</option>
            <option value="zone5" selected>Zone 5 — Europe / North America</option>
            <option value="zone6">Zone 6 — Latin America / Africa / Others</option>
          </select>
          <div style="font-size:11px;color:#888;margin-top:4px;text-align:left;">
            ※ DHL Express Easy 2026 rate (incl. fuel surcharge &amp; 5% tax). Max 25kg.
          </div>
        </div>

        <div id="shipping-preview" style="margin-bottom:14px;font-size:14px;color:#1e4f8a;font-weight:bold;">
          Shipping: NT$0
        </div>
        <button id="export-cancel" style="background:#e74c3c;color:#fff;border:none;padding:8px 16px;border-radius:4px;margin-right:10px;cursor:pointer;">CANCEL</button>
        <button id="export-ok"     style="background:#27ae60;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">EXPORT</button>
      </div>
    `;
    document.body.appendChild(m);

    const methodSelect = m.querySelector("#shipping-method");
    const zoneSelect   = m.querySelector("#shipping-zone");
    const zoneRow      = m.querySelector("#zone-row");
    const weightInput  = m.querySelector("#order-weight");
    const preview      = m.querySelector("#shipping-preview");

    function getCustomWeight() {
      const v = parseInt(weightInput.value, 10);
      return (isNaN(v) || v < 1) ? autoWeight : v;
    }

    function refreshPreview() {
      const method = methodSelect.value;
      const weight = getCustomWeight();
      const zone   = zoneSelect.value;

      zoneRow.style.display = (method === "international") ? "block" : "none";

      const fee = calcShipping(method, weight, zone);

      if (method === "pickup") {
        preview.textContent = `Shipping: NT$0  (Self Pickup)`;
      } else if (method === "taiwan") {
        preview.textContent = `Shipping: NT$150  /  Weight: ${weight}g`;
      } else {
        const zoneName = zoneSelect.options[zoneSelect.selectedIndex].text.split("—")[0].trim();
        preview.textContent = `Shipping: NT$${formatMoney(fee)}  /  ${zoneName}  /  Weight: ${weight}g`;
      }
    }

    methodSelect.addEventListener("change", refreshPreview);
    zoneSelect.addEventListener("change", refreshPreview);
    weightInput.addEventListener("input", refreshPreview);
    refreshPreview();

    m.querySelector("#export-cancel").onclick = () => m.remove();
    m.querySelector("#export-ok").onclick = () => {
      const method = methodSelect.value;
      const zone   = zoneSelect.value;
      const weight = getCustomWeight();
      const order = {
        name:           m.querySelector("#order-name").value.trim(),
        address:        m.querySelector("#order-address").value.trim(),
        weight,
        shippingMethod: method,
        shippingZone:   method === "international" ? zoneSelect.options[zoneSelect.selectedIndex].text : "",
        shippingFee:    calcShipping(method, weight, zone),
      };
      if (!order.name || !order.address) {
        alert("Please fill in name and address.");
        return;
      }
      m.remove();
      cb(order);
    };
  }

  document.querySelector(".export-btn").addEventListener("click", () => {
    if (getSelected().length === 0) {
      alert("Didn't select any item yet.");
      return;
    }
    showExportModal(order => exportStorePDF(order, getSelected()));
  });

  // ─── PDF Export ──────────────────────────────────────────────
  async function exportStorePDF(order, selected) {
    const { jsPDF }    = window.jspdf;
    const pdf          = new jsPDF("p", "mm", "a4");
    const pageWidth    = pdf.internal.pageSize.getWidth();
    const itemsPerPage = 18;
    const totalPages   = Math.ceil(selected.length / itemsPerPage);
    const subtotal     = selected.reduce((s, p) => s + p.price * p.qty, 0);
    const shipping     = order.shippingFee;
    const total        = subtotal + shipping;

    const methodName = m => {
      if (m === "pickup") return "Self Pickup";
      if (m === "taiwan") return "Taiwan Delivery";
      if (m === "international") return `International Delivery (DHL) — ${order.shippingZone || ""}`;
      return m;
    };

    // 載入圖片轉 DataURL，避免 canvas tainted
    function loadImg(src) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          try {
            const c = document.createElement("canvas");
            c.width = img.width; c.height = img.height;
            c.getContext("2d").drawImage(img, 0, 0);
            resolve(c.toDataURL("image/png"));
          } catch { resolve(""); }
        };
        img.onerror = () => resolve("");
        img.src = src;
      });
    }

    for (let page = 0; page < totalPages; page++) {
      const chunk    = selected.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
      const dataUrls = await Promise.all(chunk.map(p => loadImg(`img/${p.code}.png`)));

      const container = document.createElement("div");
      container.style = `
        position:relative;
        width:210mm; min-height:297mm;
        padding:0; margin:0; background:#fff;
        font-family:"Microsoft JhengHei",sans-serif;
      `;

      container.innerHTML = `
        <div style="
          width:100%;background:#1e4f8a;color:#fff;
          text-align:center;padding:12px 0;
          font-size:18px;font-weight:bold;
        ">MATRIX Store Order Sheet (Page ${page + 1}/${totalPages})</div>

        <div style="padding:10px 18px 6px;font-size:12px;line-height:1.7;">
          <b>Customer Info</b><br>
          Name: ${order.name}<br>
          Address: ${order.address}<br>
          Package Weight: ${order.weight}g<br>
          Shipping: ${methodName(order.shippingMethod)}
        </div>

        <table style="
          width:100%;border:1px solid #000;
          border-collapse:collapse;font-size:11px;
          margin-top:4px;table-layout:fixed;
        ">
          <thead><tr>
            <th style="border:1px solid #000;padding:5px;width:12%;">IMAGE</th>
            <th style="border:1px solid #000;padding:5px;width:18%;">SKU</th>
            <th style="border:1px solid #000;padding:5px;width:36%;">NAME</th>
            <th style="border:1px solid #000;padding:5px;width:10%;">QTY</th>
            <th style="border:1px solid #000;padding:5px;width:12%;">PRICE</th>
            <th style="border:1px solid #000;padding:5px;width:12%;">SUBTOTAL</th>
          </tr></thead>
          <tbody>
            ${chunk.map((p, i) => `
              <tr>
                <td style="border:1px solid #000;padding:5px;text-align:center;">
                  ${dataUrls[i]
                    ? `<img src="${dataUrls[i]}" style="max-width:36px;max-height:36px;">`
                    : `<div style="width:36px;height:36px;display:inline-block;border:1px solid #ccc;font-size:9px;line-height:36px;color:#999;">No Img</div>`}
                </td>
                <td style="border:1px solid #000;padding:5px;text-align:center;">${p.code}</td>
                <td style="border:1px solid #000;padding:5px;">${p.name}</td>
                <td style="border:1px solid #000;padding:5px;text-align:center;">${p.qty}</td>
                <td style="border:1px solid #000;padding:5px;text-align:right;">NT$${formatMoney(p.price)}</td>
                <td style="border:1px solid #000;padding:5px;text-align:right;">NT$${formatMoney(p.price * p.qty)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        ${page === totalPages - 1 ? `
          <div style="position:absolute;right:18px;bottom:70px;width:220px;font-size:13px;line-height:1.8;border-top:2px solid #000;padding-top:8px;">
            <div>Subtotal: NT$${formatMoney(subtotal)}</div>
            <div>Shipping: NT$${formatMoney(shipping)}</div>
            <div style="font-size:18px;font-weight:bold;color:#1e4f8a;">Total: NT$${formatMoney(total)}</div>
          </div>` : ""}

        <div style="position:absolute;bottom:20px;left:20px;font-size:12px;">
          Date: ${new Date().toLocaleDateString()}
        </div>
        <div style="position:absolute;bottom:18px;right:18px;">
          <img src="img/Matrix-icon-2.png" style="max-width:140px;">
        </div>
      `;

      document.body.appendChild(container);
      const canvas   = await html2canvas(container, { scale: 2 });
      const imgData  = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfH     = (imgProps.height * pageWidth) / imgProps.width;
      if (page > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfH);
      document.body.removeChild(container);
    }

    // ─── 下載 ────────────────────────────────────────────────
    const fileName = "MATRIX_STORE_Order.pdf";
    const pdfBlob = new Blob([pdf.output("arraybuffer")], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  }

  // ─── Routing: #item/<code> opens a product detail page, anything
  // else falls back to the last (or default) category. ──────────
  function handleHashRoute() {
    const m = location.hash.match(/^#item\/(.+)$/);
    if (m) {
      showProductDetail(decodeURIComponent(m[1]));
    } else {
      showSection(lastCategory, lastMobileAll);
      highlightSidebarFor(lastCategory);
    }
  }
  window.addEventListener("hashchange", handleHashRoute);

  // ─── Init ────────────────────────────────────────────────────
  handleHashRoute();
  updateCart();
});