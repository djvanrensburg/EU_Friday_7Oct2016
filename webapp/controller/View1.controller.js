sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("z.controller.View1", {
		onInit: function() {
			this.oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.oView));
			this.oModel = this._oComponent.getModel();
			this.oView.setModel(this.oModel);
			
			var oUploadCollection = this.getView().byId("file_list");
			oUploadCollection.setUploadUrl(this.oModel.sServiceUrl + "/PhotoSet");
		},

		/********************* 
		OPERATIONS on FILES 
		**********************/

		onChangeFileUpload: function(oEvent) {
			var oUploadCol = oEvent.getSource();
			this.addedFile = oEvent.getParameter("files")[oEvent.getParameter("files").length - 1];

			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: this.oModel.getSecurityToken()
			});
			oUploadCol.addHeaderParameter(oCustomerHeaderToken);
		},

		onBeforeUploadStarts: function(oControlEvent) {
			var oUploadCol = oControlEvent.getSource();
			oUploadCol.setBusy(true);
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: this.oModel.getSecurityToken()
			});
			oUploadCol.addHeaderParameter(oCustomerHeaderToken);
			var myID = this._oComponent.getModel("initParams").getProperty("/myID");

			var sSlug = oControlEvent.getParameters().fileName + "," + myID;
			//Get the Doc type selected for this file
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: sSlug
			});
			oControlEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},

		onFileDeleted: function(oControlEvent) {
			sap.m.MessageToast.show("File " + oControlEvent.getParameters().fileName + " successfully deleted");
		},

		onUploadComplete: function(oControlEvent) {
			sap.m.MessageToast.show("File " + oControlEvent.getParameters().fileName + " successfully uploaded");
			oControlEvent.getSource().setBusy(false);
		},

		onFileSizeExceeded: function(oControlEvent) {
			sap.m.MessageToast.show("Maximum file size exceeded: " + oControlEvent.getParameter("fileSize") + "Mb. Maximum allow is 3Mb");
		},

		doFileUpload: function(oData) {
			var oUploadCollection = this.getView().byId("file_list");
			//check to see if any attachments were added
			this._filesToUpload = 0;
			for (var i = 0; i < oUploadCollection.getItems().length; i++) {
				if (oUploadCollection.getItems()[i]._status === "pendingUploadStatus") {
					this._filesToUpload++;
					break;
				}
			}

			if (this._filesToUpload === 0) {
				sap.m.MessageToast.show("No Files to upload");
			} else {
				oUploadCollection.upload();
			}
		}
	});

});