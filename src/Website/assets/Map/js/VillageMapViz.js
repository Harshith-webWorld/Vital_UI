import { DistrictMap_Leaflet } from '../../../assets/Map/js/DistrictMap_Leaflet';
import $ from 'jquery';
import config from '../../../assets/Map/data/metadata/config.js';
import * as d3 from 'd3';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import select2 from 'select2';
export function VillageMapViz() {}
var geojsonObj = "";
VillageMapViz.prototype = {
  setup: function (args) {
    // setup variables
    this.district_name = "Ahmadnagar";
    this.field_name = "Total.Population.of.Village";
    this.districtMap = new DistrictMap_Leaflet();
    this.isCustom = false;
    this.csv = undefined;
    this.customFieldToMatch = "Village.Code";
    // call to create leaflet map
    this.createMap();

    // populate district list
    this.createDistrictList();

    // attach change events for district and attribute
    this.attachEvents();

  },

  createMap: function () {
    this.districtMap.setup({
      divId: "map_container",
      district_name: this.district_name,
      field_name: this.field_name,
    });
  },
  
  createDistrictList: function () {
    // District List comes from config.js
    var selectHTML = "";
    selectHTML += '<option>Choose Village</option>';
    
    for (const element of config.districts) {
      selectHTML +=
        "<option value='" + element + "'>" + element + "</option>";
    }
    $("#district-list").html(selectHTML);
    $("#district-list").val("Ahmadnagar");
    $("#district-list").select2();
    this.loadAssociated_Villages("Ahmadnagar");
  },

  attachEvents: function () {
    var self = this;

    $("#district-list").on("change", function (val) {
      self.district_name = $("#district-list").val();
      self.districtMap.setDistrictName(self.district_name);
      self.loadAssociated_Villages(self.district_name);
     
    });
  },
  
  loadAssociated_Villages: function (choosed_district) {
    $.ajax({
      url: "geometry/" + config.geojson_file_map[choosed_district] + ".geojson",
      success: function (response) {
        geojsonObj = response;

        var selectDropdownHTML = "";
        selectDropdownHTML += '<option>Choose Village</option>';
        for (const element of geojsonObj.features) {
          selectDropdownHTML += "<option  value='" + element.properties.GPNAME +"'>" +element.properties.GPNAME + "</option>";
        }
        $("#village-list").html(selectDropdownHTML);
        $("#village-list").select2();
      },
    });
  },
 

};
