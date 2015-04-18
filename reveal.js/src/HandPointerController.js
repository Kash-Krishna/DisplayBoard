var sensor;
 
function KinectInit()
{
	console.log("jkl");
	Kinect.connect("http://localhost", 8181);


	var specificSensorChooser = new KinectSensorChooser();
	specificSensorChooser.RequiredConnectionId = "USB\VID_045E&PID_02C2\5&2080E735&0&6";
	var defaultSensorChooser = new KinectSensorChooser();
	var webserver = new KinectWebserver();
	webserver.SensorChooserMap.Add("specific", specificSensorChooser);
	webserver.SensorChooserMap.Add("default", defaultSensorChooser);
	specificSensorChooser.Start();
	defaultSensorChooser.Start();
	webserver.Start();

	sensor = Kinect.sensor();
}
 
 function KinectThings()
 {
	
	console.log("asdf");
	
	sensor.getConfig( function (configData){});
	
	var configuration = {
	 
		"interaction" : {
			"enabled": true,
		},
	 
		"userviewer" : {
			"enabled": true,
			"resolution": "640x480", //320x240, 160x120, 128x96, 80x60
			"userColors": { "engaged": 0xffffffff, "tracked": 0xffffffff },
			"defaultUserColor": 0xffffffff, //RGBA
		},
	 
		"backgroundRemoval" : {
			"enabled": true,
			"resolution": "640x480", //1280x960
		},
	 
		"skeleton" : {
			"enabled": true,
		},
	 
		"sensorStatus" : {
			"enabled": true,
		}
	 
	};
	  
	sensor.postConfig( configuration );
	
	var uiAdapter = KinectUI.createAdapter(sensor);
	
	for (var i = 0; i < uiAdapter.handPointers.length; ++i) {
		var handPointer = uiAdapter.handPointers[i];
		var handPointerCursor = uiAdapter.createDefaultCursor();
		handPointerCursor.show();
	}
	
	sensor.addStreamFrameHandler( SkeletonStreamHandler );
 }
 
 function SkeletonStreamHandler(frame) {
	switch (frame.stream) {
		case Kinect.SKELETON_STREAM_NAME:
			for (var iSkeleton = 0; iSkeleton < frame.skeletons.length; ++iSkeleton) {
				var skeleton = frame.skeletons[iSkeleton];
							
				skeleton.trackingId;
				skeleton.trackingState;
				skeleton.position;
							
				for (var iJoint = 0; iJoint < skeleton.joints.length; ++iJoint) {
					var joint = skeleton.joints[iJoint];
					joint.jointType;
					joint.trackingState;
					joint.position; 
				}
			}
			
		break;
	}
}