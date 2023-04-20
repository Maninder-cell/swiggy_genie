mapboxgl.accessToken = 'pk.eyJ1IjoibmF1c2hhZGlhIiwiYSI6ImNsZ2tvM2x2bjBmOHczZ3FzaG1wcGloc2MifQ.8WmcqqOv6LALyf-CuVpAog';
        const map = new mapboxgl.Map({
            container: 'map',
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-79.4512, 43.6568],
            zoom: 13
        });

        var directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken
        });

        map.addControl(directions, 'top-left');

        directions.on('route', () => {
            var data = {
                origin: directions.getOrigin(),
                destination: directions.getDestination(),
            };
            
            fetch('http://localhost:3000/distance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode:"cors",
                body: JSON.stringify(data)
            })
                .then(function (response) {
                    // handle the response from the server
                    console.log(response);
                })
                .catch(function (error) {
                    // handle any errors
                    console.error(error);
                });
        });