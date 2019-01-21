import { LightningElement, track } from 'lwc';

export default class Webcomponent1 extends LightningElement {
    greeting = "yolo";
    mapMarkers = [{
        location: {
            "Latitude": -33.1234,
            "Longitude": 151.1234
        },
        title: 'Point 1',
        description: "Warehouse",
        icon: 'standard:account'
    }]

}