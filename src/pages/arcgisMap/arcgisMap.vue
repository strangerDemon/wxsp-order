<template>
    <div class="claro">
        <div data-dojo-type="dijit/layout/BorderContainer" data-dojo-props="design:'headline', gutters:false" style="width:100%;height:100%;margin:0;">
            <div id="map" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'" style="padding:0;">
                <div style="position:absolute; right:20px; top:10px; z-Index:999;">
                    <div data-dojo-type="dijit/TitlePane" data-dojo-props="title:'Switch Basemap', open:true">
                        <div data-dojo-type="dijit/layout/ContentPane" style="width:380px; height:280px; overflow:auto;">
                            <div id="basemapGallery"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "map",
        directives: {},
        components: {},
        data() {
            return {
                map: null
            }
        },
        props: {},
        computed: {},
        watch: {},
        methods: {
            init() {
                let vm = this
                require([
                    "esri/map", "esri/dijit/BasemapGallery", "esri/arcgis/utils",
                    "dojo/parser",
                    "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/TitlePane",
                    "dojo/domReady!"
                ], function(
                    Map, BasemapGallery, arcgisUtils,
                    parser
                ) {
                    parser.parse();
                    vm.map = new Map("map", {
                        basemap: "topo",
                        center: [-105.255, 40.022],
                        zoom: 13
                    });
                    //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
                    var basemapGallery = new BasemapGallery({
                        showArcGISBasemaps: true,
                        map: vm.map
                    }, "basemapGallery");
                    basemapGallery.startup();
                    basemapGallery.on("error", function(msg) {
                        console.log("basemap gallery error:  ", msg);
                    });
                });
            }
        },
        beforeCreate() {},
        created() {},
        destroyed() {},
        mounted() {
            this.init();
        }
    }
</script>
<style lang="css" scoped>
    .claro {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>