sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"z/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("z.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			var oMyId = {
				myID: this.getMetadata().getManifestEntry("/sap.ui5/models/initParams/myID")
			};

			var oInitParamModel = new sap.ui.model.json.JSONModel(oMyId);
			oInitParamModel.setDefaultBindingMode("OneWay");
			this.setModel(oInitParamModel, "initParams");

		}
	});

});