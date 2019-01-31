import { LightningElement, wire, track } from 'lwc';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

// import leaflet css?
import leaflet from '@salesforce/resourceUrl/leaflet';




export default class mapLocationsToDeliver extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    
    markerIconUrl = leaflet + '/images/marker-icon.png';
    markerIconUrl2x = leaflet + '/images/marker-icon-2x.png';
    markerShadow = leaflet + '/images/marker-shadow.png';

    leafletInit = false;
    myMap;
    leafletMarkers;
    polyLines = null;

    zoom = 13;

    origin = {
        location: {
            "Latitude": -33.8988,
            "Longitude": 151.2093
        },
        title: 'Point 1',
        description: "Warehouse",
        icon: 'standard:account'
    };

    @track mapMarkers = [{
        location: {
            "Latitude": -33.8688,
            "Longitude": 151.2093
        },
        title: 'Point 1',
        description: "Warehouse",
        icon: 'standard:account'
    }]

    connectedCallback() {
        registerListener('destinationsAreSet', this.handleDestinations, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleDestinations(contacts){
        console.log("received event: destinationsAreSet");
        
        this.mapMarkers = [];
        this.mapMarkers.push(this.origin);

        console.log(contacts.map(element=>{return element.Name}));
        
        for (let c of contacts) {
            let dest = {
                location: {
                    'City': c.MailingCity,
                    'Country': c.MailingCountry,
                    'PostalCode': c.PostalCode,
                    'State': c.MailingState,
                    'Street': c.MailingStreet,
                    'Latitude': parseFloat(c.MailingLatitude),
                    'Longitude': parseFloat(c.MailingLongitude)
                },
                title: c.Name,
                description: "None atm",
                icon: 'standard:account',
            }
            this.mapMarkers.push(dest);
        }

        //clear old markers
        for (let m of this.leafletMarkers){
            this.myMap.removeLayer(m);            
        }
        console.log("Removed all old markers.");

        for (let i of this.mapMarkers){
            let lat = i['location']['Latitude'];
            let lon = i['location']['Longitude'];
            let marker = L.marker([lat, lon]).addTo(this.myMap);
            this.leafletMarkers.push(marker);
        }

        this.drawPolyLines();
    }

    drawPolyLines() {
        console.log(this.polyLines);
        if (this.polyLines !== null) {
            console.log('Clearing polylines');
            this.myMap.removeLayer(this.polyLines);
        }

        console.log("ADDING POLY LINE");
        let lines = this.mapMarkers.map( element => { 
            return [element['location']['Latitude'], element['location']['Longitude']];
        });
        console.log(lines);

        this.polyLines = L.polyline.antPath(lines);
        this.polyLines.addTo(this.myMap);
    }

    renderedCallback(){
        if (this.leafletInit){
            return;
        }
        this.leafletInit = true;

        Promise.all(
            [
                loadStyle(this, leaflet + '/leaflet.css'),
                // loadScript(this, leaflet + '/leaflet.js')
                loadScript(this, leaflet + '/leaflet-ant-path.js')
            ]
        ).then(() => {
            this.initialiseLeaflet();
        }).catch((error) => {
            console.log('COMPUTER SAYS NO to load leaflet scripts: ' + error);
        });        
    }

    initialiseLeaflet() {
        console.log('COMPUTER will now do "things" to initialise leaflet');            
        let mapElement = this.template.querySelector('div.LeafMap');

        this.myMap = L.map(mapElement, {            
            zoom: false,
        }).setView([-33.8688, 151.2093], 13);
        
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.myMap);

        this.leafletMarkers = [];        
    }
}