    function showCoverage() {


        plotCoverage();

        var flag = document.getElementById("respondentcbox").checked;

        if (flag) {
            map.getPane('respondents').style.zIndex = 401;
            resGroup.addTo(map);

        } else {
            map.getPane('respondents').style.zIndex = 401;
            map.removeLayer(resGroup);
        }
    }

    function markerCheckBox() {
        allIssues = [];
        // Get the checkbox
        var tencheckBox = document.getElementById("tencbox");
        var viocheckBox = document.getElementById("viocbox");
        var govcheckBox = document.getElementById("govcbox");
        // Get the output text



        // If the checkbox is checked, display the output text
        if (tencheckBox.checked) {
            allIssues = allIssues.concat(tenIssues);
        }
        if (viocheckBox.checked) {
            allIssues = allIssues.concat(vioIssues);
        }

        if (tencheckBox.checked && viocheckBox.checked) {
            document.getElementById("gradient-legend").style.backgroundImage = "linear-gradient(90deg,rgba(0,0,0,.0), #FF6600)";
            createHeatMapLayer(tenIssues, vioIssues);


        } else if (tencheckBox.checked && !(viocheckBox.checked)) {
            document.getElementById("gradient-legend").style.backgroundImage = "linear-gradient(90deg,rgba(0,0,0,.0), #FFC234)";
            createHeatMapLayer(tenIssues, []);

        } else if (!(tencheckBox.checked) && viocheckBox.checked) {
            document.getElementById("gradient-legend").style.backgroundImage = "linear-gradient(90deg,rgba(0,0,0,.0), #A82C15)";
            createHeatMapLayer([], vioIssues);

        } else {
            createHeatMapLayer([], []);

        }



        tensionMarkerGroup.clearLayers();
        violenceMarkerGroup.clearLayers();

        createMarkers();
        hideMarkersOnZoom();

        // createHeatMapLayer(tenIssues, tenheatmapLayer);


    }




    function createMarkers() {

        for (var i = 0; i < allIssues.length; i++) {


            var temptitle = allIssues[i].barangay + " | " + allIssues[i].city + " | " + allIssues[i].municipality + " | " + allIssues[i].province + " | " + allIssues[i].issue;

            var markerOptions = {
                title: temptitle,
                radius: 5,
                fillColor: allIssues[i].color,
                color: "#000000",
                fillOpacity: 1,
                weight: 2,
                pane: 'markerspane',
                type: allIssues[i].issue

            };


            var town;
            if (allIssues[i].municipality != "") {
                town = allIssues[i].municipality
            } else {
                town = allIssues[i].city
            }
            var popuphtml =
                "<span class='popuplabel'>Date: </span>" + allIssues[i].date + "&nbsp&nbsp&nbsp&nbsp<span class='popuplabel'>Date Reported:</span> " + allIssues[i].datereported +
                "<br><span class='popuplabel'>Issue: </span>" + allIssues[i].issue + "<br>" +
                "<span class='popuplabel'>City/Municipality: </span>" + town + "<br>" +
                "<span class='popuplabel'>Details: </span>" + allIssues[i].details + "<br>"



            if (allIssues[i].issue == 'Tensions') {
                var marker = L.circleMarker(new L.LatLng(allIssues[i].lat, allIssues[i].lng), markerOptions);
                marker.bindPopup(popuphtml);
                tensionMarkerGroup.addLayer(marker);

                // } else if (allIssues[i].issue == 'Government/Private sector response') {
                //     var marker = L.circleMarker(new L.LatLng(allIssues[i].lat, allIssues[i].lng), markerOptions);
                //     marker.bindPopup(popuphtml);

            } else if (allIssues[i].issue == 'Violence') {
                var marker = L.circleMarker(new L.LatLng(allIssues[i].lat, allIssues[i].lng), markerOptions);
                marker.bindPopup(popuphtml);
                tensionMarkerGroup.addLayer(marker);

            }


        }

        map.addLayer(tensionMarkerGroup);
        // map.addLayer(violenceMarkerGroup);
        // map.addLayer(markers2);


    }




    function getColor(d) {
        //alert(d);
        return d > 1000 ? '#67340B' :
            d > 500 ? '#834311' :
                d > 200 ? '#964C15' :
                    d > 100 ? '#A45518' :
                        d > 50 ? '#B5651D' :
                            d > 25 ? '#C89C49' :
                                d > 1 ? '#FFEDA0'
                                    : '#FFFFFF';
    }


    function style0(feature) {
        var opacity;
        if (document.getElementById("1myRange") != null) {
            document.getElementById("1myRange").value = 75;
            opacity = document.getElementById("1myRange").value / 100;
        } else {
            opacity = ".75";

        }
        return {
            fillColor: getColor(feature.properties.covidcases),
            weight: 1,
            opacity: .75,
            color: 'black',
            dashArray: '1',
            fillOpacity: opacity
        };
    }


    function style1() {
        
        var opacity
        if (document.getElementById("1myRange") != null) {
            document.getElementById("1myRange").value = 75;
            opacity = document.getElementById("1myRange").value / 100;
        } else {
            opacity = "75";

        }

        return {
            fillColor: 'white',
            weight: 1,
            opacity: .75,
            color: 'black',
            dashArray: '3',
            fillOpacity: opacity
        };
    }



    function highlightFeature(e) {
        var layer = e.target;
        info.update(layer.feature.properties, false);
    }

    function resetHighlight(e) {

        temp = {
            covidcases: '- ',
            area: 'Hover over an Area'
        }
        info.update(temp, true);


    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
    }

    // zoomedOut.setOpacity(.5);//pwede icontrol


    function switchlayer(layer) {

        if (map.hasLayer(geojson)) {
            map.removeLayer(geojson)
        }

        if (map.hasLayer(vectorGrid)) {
            map.removeLayer(vectorGrid);
            console.log('w');
        }

        if (layer == 'locnone') {
            document.getElementById('show').classList.remove('selected');
            document.getElementById('dontshow').classList.add('selected');
            map.removeControl(legend);

        } else if (layer == 'locreg') {
            regionalLayer.setStyle(currentstyle);
            regionalLayer.addTo(map);
            geojson = regionalLayer;

        } else if (layer == 'locmun') {
            municipalLayer.setStyle(currentstyle);
            municipalLayer.addTo(map);
            geojson = municipalLayer;

        } else if (layer == 'locprov') {
            provincialLayer.setStyle(currentstyle);
            provincialLayer.addTo(map);
            geojson = provincialLayer;

        } else if (layer = 'locbrg') {
            vectorGrid.addTo(map);
        }


    }


    function removeSelected() {
        document.getElementById('dontshow').classList.remove('selected');
        document.getElementById('show').classList.remove('selected');

    }

    function removeLoCSelected() {
        document.getElementById('locreg').classList.remove('selected');
        document.getElementById('locprov').classList.remove('selected');
        document.getElementById('locmun').classList.remove('selected');
        document.getElementById('locbrg').classList.remove('selected');
        document.getElementById('locnone').classList.remove('selected');
    }

    function setSelected(id) {
        document.getElementById(id).classList.add('selected');
    }


    function dohButtonSelected(t) {
        removeSelected();
        setSelected(t.id);
        if (t.id == 'dontshow') {
            currentstyle = style1
            map.removeControl(legend);
        }
        else {
            currentstyle = style0

            map.addControl(legend);
        }
        geojson.setStyle(currentstyle);
    }





    function locButtonSelected(t) {

        if (t.id == "dontshow") {

            geojson.setStyle(style1);
            map.removeControl(legend);
            map.removeControl(info);
            removeLoCSelected();
            setSelected(t.id);

        } else {
            removeLoCSelected()
            // map.addControl(info);
            // map.addControl(legend);
            switchlayer(t.id);
            setSelected(t.id);
        }
    }


    function enableMapInteraction() {

        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();


    }

    function disableMapInteraction() {
        
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();


    }

    function modalClose() {
        enableMapInteraction()
        document.getElementById('dimmedOverlay').classList.add('hiddenmodal');
        document.getElementById('introModal').classList.add('hiddenmodal');
        document.getElementById('tutorialModal').classList.add('hiddenmodal');

    }

    function modalOpen() {

        disableMapInteraction();
        document.getElementById('dimmedOverlay').classList.remove('hiddenmodal');
        document.getElementById('introModal').classList.remove('hiddenmodal');

    }


    function tutmodalOpen() {
        

        document.getElementById('dimmedOverlay').classList.remove('hiddenmodal');
        document.getElementById('tutorialModal').classList.remove('hiddenmodal');

    }



    function updateDates() {
        document.getElementById('cemsdate').innerHTML = incidentAsOfDate;
        document.getElementById('dohdate').innerHTML = incidentAsOfDate;

    }



    function arrangeIssuesData(data) {
        var heatMapData = { max: 10, data: [{}] };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];

            heatMapData.data[index] = { lat: data[index].lat, lng: data[index].lng, count: 1 }

        }


        return heatMapData;
    }


    function createHeatMapLayer(tensiondata, violencedata) {

        map.removeLayer(heatmapLayer);
        this.heatmapLayer = new HeatmapOverlay(cfg);

        map.removeLayer(heatmapLayer2);
        this.heatmapLayer2 = new HeatmapOverlay(cfg2);

        if (tensiondata.length > 0) {

            heatmapLayer.setData(arrangeIssuesData(tensiondata));
            heatmapLayer.addTo(map);

        }


        if (violencedata.length > 0) {

            heatmapLayer2.setData(arrangeIssuesData(violencedata));
            heatmapLayer2.addTo(map);

        }

        // enable event forwarding
    }



    var resGroup = L.layerGroup();

    function plotCoverage() {

        var iconSize = smallerIcon;

        for (let i = 0; i < coverage.length; i++) {

            var markerOptions = {
                icon: coverageIcon,
                radius: 10

            }
            L.marker([coverage[i].lat, coverage[i].lng], markerOptions).addTo(resGroup);

        }


    }


    // change CFG on marker check/uncheck

    function hideMarkersOnZoom() {

        var zoom = map.getZoom();
        if (zoom <= 9 && map.hasLayer(tensionMarkerGroup)) {
            map.removeLayer(tensionMarkerGroup);


        }
        if (zoom > 9 && map.hasLayer(tensionMarkerGroup) == false) {
            map.addLayer(tensionMarkerGroup);
            // cfg.radius = 0.05;
            // cfg2.radius = 0.05;
            
        }
        if (zoom <= 9 && map.hasLayer(violenceMarkerGroup)) {
            map.removeLayer(violenceMarkerGroup);


        }
        if (zoom > 9 && map.hasLayer(violenceMarkerGroup) == false) {
            map.addLayer(violenceMarkerGroup);

        }
        cfg.radius = heatmapradius[zoom];
        cfg2.radius = heatmapradius[zoom];
        


    }

    function resizeCircleradius() {

        if (map.hasLayer(resGroup)) {


            var zoom = map.getZoom();

            if (zoom <= 9) {
                var width = zoom;
                var height = zoom * 2;
                var smallerIcon = L.icon({
                    iconUrl: './icons/ERN geotag.png',
                    iconSize: [20 - width, 35 - height], // size of the icon
                    pane: 'markersPane'

                })
                resGroup.eachLayer(function (layer) {

                    return layer.setIcon(smallerIcon);

                })

            } else {
                resGroup.eachLayer(function (layer) {
                    return layer.setIcon(coverageIcon);

                })


            }
        }
    }


    function adjustAdminborders() {
        var zoom = map.getZoom();
        var weight = 1;
        var dashArray = "3";

        if (zoom > 9) {
            weight = 1;
            dashArray = "5 10";
            console.log('adjust dash')
        }
        geojson.setStyle({
            weight: weight,
            dashArray: dashArray
        });


    }

    function switchFromBrgyOnZoom() {
        var zoom = map.getZoom();
        console.log('zoom :>> ', zoom);

        if ((zoom <= 9) && map.hasLayer(vectorGrid) ) {
            
            locButtonSelected(document.getElementById('locmun'));
        }

    }


    function checkIfZoomed() {
        if (map.getZoom() >= 10) {
            locButtonSelected(document.getElementById('locbrg'));

        }

    }

    function disableBrgy() {
        var zoom = map.getZoom();

        if (zoom <= 9) {
            document.getElementById('locbrg').classList.add("disabledButton");
        } else {

            document.getElementById('locbrg').classList.remove("disabledButton");
        }
    }

    function adjustMarkers() {

        // document.getElementById('zoomleveldiv').innerHTML = "zoom level: " + map.getZoom();

        hideMarkersOnZoom();
        plotCoverage();
        switchFromBrgyOnZoom();
        disableBrgy();
        resizeCircleradius();
        adjustAdminborders();



    }