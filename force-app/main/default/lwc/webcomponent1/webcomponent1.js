import { LightningElement } from 'lwc';

export default class Webcomponent1 extends LightningElement {
    greeting = "yolo";
    zoom = 13;
    mapMarkers = [{
        location: {
            "Latitude": -33.8688,
            "Longitude": 151.2093
        },
        title: 'Point 1',
        description: "Warehouse",
        icon: 'standard:account'
    }]

}