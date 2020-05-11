---
layout: post
title:  "Sitefinity Configuration File Changes When Creating and Activating a Dynamic Module"
date:   2012-10-10
description: "Sitefinity Configuration File Changes When Creating and Activating a Dynamic Module"
categories: [programming]
tags: [sitefinity]
---
After you create and activate a dynamic module with Module Builder in Sitefinity several configuration files are changes inside of App_Data/Sitefinity/Configuration.  Here’s a list of what is changed.

## ContentViewConfig.config
A config:link element is added under contentViewControls.  Example:
{% highlight xml %}
<config:link definitionName="Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChangeBackendDefinition" path="dynamicModulesConfig/contentViewControls/Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChangeBackendDefinition" module="ModuleBuilder" />
{% endhighlight %}

## DynamicModulesConfig.config
And entire contentViewControl section is added under the contentViewControls element. Example:

{% highlight xml %}
<contentViewControl contentType="Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChange" managerType="Telerik.Sitefinity.DynamicModules.DynamicModuleManager, Telerik.Sitefinity" useWorkflow="True" definitionName="Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChangeBackendDefinition">
<views>
<view gridCssClass="sfPagesTreeview" searchFields="Title" doNotBindOnClientWhenPageIsLoaded="False" allowPaging="True" allowUrlQueries="True" disableSorting="False" itemsPerPage="50" canUsersSetItemsPerPage="False" sortExpression="LastModified DESC" detailsPageId="00000000-0000-0000-0000-000000000000" webServiceBaseUrl="~/Sitefinity/Services/DynamicModules/Data.svc/" templateEvaluationMode="None" itemsParentId="00000000-0000-0000-0000-000000000000" renderLinksInMasterView="True" enableSocialSharing="False" displayMode="Read" useWorkflow="True" title="Config changes" viewType="Telerik.Sitefinity.DynamicModules.Web.UI.Backend.DynamicContentMasterGridView" viewName="Config changeBackendList" type:this="Telerik.Sitefinity.Web.UI.ContentUI.Views.Backend.Master.Config.MasterGridViewElement, Telerik.Sitefinity">
<decisionScreens>
<add decisionType="NoItemsExist" displayed="False" messageText="No config changes have been created yet" messageType="Neutral" name="NoItemsExistScreen">
<actions>
<add commandName="create" commandButtonType="Create" isFilter="False" permissionSet="Configchangetests-ConfigChange" actionName="Create" relatedSecuredObjectTypeName="Telerik.Sitefinity.DynamicModules.Builder.Model.DynamicModuleType" relatedSecuredObjectId="95f17af4-12b4-491f-bfbd-f4cf8c02c0b0" cssClass="sfCreateItem" text="Create a config change" wrapperTagKey="Unknown" isSeparator="False" name="Create" />
</actions>
</add>
</decisionScreens>
<dialogs>
<add name="ContentViewInsertDialog" openOnCommand="create" height="100%" width="100%" initialBehaviors="Maximize" behaviors="None" autoSizeBehaviors="Default" isfullscreen="False" visiblestatusbar="False" visibletitlebar="False" params="?ControlDefinitionName=Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChangeBackendDefinition&amp;ViewName=Config changeBackendInsertView" ismodal="False" destroyOnClose="False" ReloadOnShow="False" cssclass="sfMaximizedWindow" id="ContentViewInsertDialog on create" />
<add name="ContentViewEditDialog" openOnCommand="edit" height="100%" width="100%" initialBehaviors="Maximize" behaviors="None" autoSizeBehaviors="Default" isfullscreen="False" visiblestatusbar="False" visibletitlebar="False" params="?ControlDefinitionName=Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChangeBackendDefinition&amp;ViewName=Config changeBackendEditView&amp;Id={{Id}}" ismodal="False" destroyOnClose="False" ReloadOnShow="False" cssclass="sfMaximizedWindow" id="ContentViewEditDialog on edit" />
<add name="ContentViewEditDialog" openOnCommand="preview" height="100%" width="100%" initialBehaviors="Maximize" behaviors="None" autoSizeBehaviors="Default" isfullscreen="False" visiblestatusbar="False" visibletitlebar="False" params="?ControlDefinitionName=Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChangeBackendDefinition&amp;ViewName=Config changeBackendPreviewView" ismodal="False" destroyOnClose="False" ReloadOnShow="False" cssclass="sfMaximizedWindow" id="ContentViewEditDialog on preview" />
<add name="ModulePermissionsDialog" openOnCommand="permissions" height="100%" width="100%" initialBehaviors="Maximize" behaviors="None" autoSizeBehaviors="Default" isfullscreen="False" visiblestatusbar="False" visibletitlebar="False" params="?moduleName=ModuleBuilder&amp;typeName=Telerik.Sitefinity.DynamicModules.Builder.Model.DynamicModuleType&amp;securedObjectId=95f17af4-12b4-491f-bfbd-f4cf8c02c0b0&amp;backLabelText=Back to items&amp;title=Permissions&amp;permissionSetName=Configchangetests-ConfigChange" ismodal="False" destroyOnClose="False" ReloadOnShow="False" cssclass="sfMaximizedWindow" id="ModulePermissionsDialog on permissions" />
</dialogs>
<viewModes>
<add EnableDragAndDrop="False" EnableInitialExpanding="False" Name="Grid" type:this="Telerik.Sitefinity.Web.UI.ContentUI.Views.Backend.Master.Config.GridViewModeElement, Telerik.Sitefinity">
<columns>
<add clientTemplate="&lt;a sys:href=’javascript:void(0);’ sys:class=&quot;{{ ‘sf_binderCommand_edit sfItemTitle sf’ + Lifecycle.WorkflowStatus.replace(‘ ‘,”).toLowerCase()}}&quot;&gt;&lt;strong&gt;{{Title}}&lt;/strong&gt;&lt;span class=’sfStatusLocation’&gt;{{Lifecycle.WorkflowStatus}}&lt;/span&gt;&lt;/a&gt;" headerCssClass="sfTitleCol" headerText="Title" itemCssClass="sfTitleCol" width="0" disableSorting="False" name="Title" type:this="Telerik.Sitefinity.Web.UI.ContentUI.Views.Backend.Master.Config.DataColumnElement, Telerik.Sitefinity" />
<add headerCssClass="sfMoreActions" headerText="Actions" itemCssClass="sfMoreActions" width="0" disableSorting="False" name="Actions" type:this="Telerik.Sitefinity.Web.UI.ContentUI.Views.Backend.Master.Config.ActionMenuColumnElement, Telerik.Sitefinity">
<mainAction commandButtonType="Standard" isFilter="False" wrapperTagKey="Unknown" isSeparator="False" />
<menuItems>
<menuItem commandName="delete" commandButtonType="Standard" isFilter="False" cssClass="sfDeleteItm" text="Delete" wrapperTagKey="Li" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="Delete" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
</menuItems>
</add>
<add clientTemplate="&lt;span&gt;{{Author}}&lt;/span&gt;" resourceClassId="Labels" headerCssClass="sfAuthor" headerText="Author" itemCssClass="sfAuthor" width="0" disableSorting="False" name="Author" type:this="Telerik.Sitefinity.Web.UI.ContentUI.Views.Backend.Master.Config.DataColumnElement, Telerik.Sitefinity" />
<add clientTemplate="&lt;span&gt;{{ (PublicationDate) ? PublicationDate.sitefinityLocaleFormat(‘dd MMM, yyyy hh:mm:ss’): ‘-‘ }}&lt;/span&gt;" resourceClassId="ModuleBuilderResources" headerCssClass="sfDateAndHour" headerText="PublicationDate" itemCssClass="sfDateAndHour" width="0" disableSorting="False" name="PublicationDate" type:this="Telerik.Sitefinity.Web.UI.ContentUI.Views.Backend.Master.Config.DataColumnElement, Telerik.Sitefinity" />
</columns>
</add>
</viewModes>
<links>
<add navigateUrl="[node:70aef8e7-1bf8-49d0-a7c9-21b90fb9c7a6]/fa2e4a73-929b-4050-a4ac-6030808f41cf" commandName="goBackToContentTypes" name="NavigateToContentTypesLink" />
</links>
<toolbar wrapperTagKey="Unknown">
<sections>
<section titleWrapperTagKey="Unknown" wrapperTagKey="Unknown" visible="True" name="toolbar">
<items>
<item commandName="create" commandButtonType="Create" isFilter="False" permissionSet="Configchangetests-ConfigChange" actionName="Create" relatedSecuredObjectTypeName="Telerik.Sitefinity.DynamicModules.Builder.Model.DynamicModuleType" relatedSecuredObjectId="95f17af4-12b4-491f-bfbd-f4cf8c02c0b0" cssClass="sfMainAction" text="Create a Config change" wrapperTagKey="Unknown" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="CreateItemWidget" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
<item commandName="groupDelete" commandButtonType="Standard" isFilter="False" permissionSet="Configchangetests-ConfigChange" actionName="Delete" relatedSecuredObjectTypeName="Telerik.Sitefinity.DynamicModules.Builder.Model.DynamicModuleType" relatedSecuredObjectId="95f17af4-12b4-491f-bfbd-f4cf8c02c0b0" text="Delete" wrapperTagKey="Unknown" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="DeleteItemWidget" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
<item text="More actions" wrapperTagKey="Li" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.ActionMenuWidget" isSeparator="False" name="MoreActionsItemWidget" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.ActionMenuWidgetElement, Telerik.Sitefinity">
<mainAction commandButtonType="Standard" isFilter="False" wrapperTagKey="Unknown" isSeparator="False" />
<menuItems>
<item commandName="groupPublish" commandButtonType="Standard" isFilter="False" cssClass="sfPublishItm" text="Publish" wrapperTagKey="Unknown" isSeparator="False" name="PublishItemWidget" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
<item commandName="groupUnpublish" commandButtonType="Standard" isFilter="False" cssClass="sfUnpublishItm" text="Unpublish" wrapperTagKey="Unknown" isSeparator="False" name="UnpublishItemWidget" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
</menuItems>
</item>
<item persistentTypeToSearch="Telerik.Sitefinity.GenericContent.Model.Content" mode="NotSet" commandName="search" commandButtonType="Standard" isFilter="False" text="Search" wrapperTagKey="Unknown" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.SearchWidget" isSeparator="False" name="SearchItemWidget" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.SearchWidgetElement, Telerik.Sitefinity" />
</items>
</section>
</sections>
</toolbar>
<sidebar title="Manage Config changes" wrapperTagKey="Unknown">
<sections>
<section title="Filter Config change" titleWrapperTagKey="Unknown" wrapperTagKey="Unknown" cssClass="sfFirst sfWidgetsList sfSeparator sfModules" visible="True" name="Filter">
<items>
<item commandName="showAllItems" commandButtonType="SimpleLinkButton" isFilter="False" buttonCssClass="sfSel" text="All Config changes" wrapperTagKey="Unknown" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="AllItems" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
<item commandName="showMyItems" commandButtonType="SimpleLinkButton" isFilter="False" text="My Config change" wrapperTagKey="Unknown" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="MyItems" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
</items>
</section>
<section title="Settings" titleWrapperTagKey="Unknown" wrapperTagKey="Unknown" cssClass="sfWidgetsList sfSettings" resourceClassId="ModuleBuilderResources" visible="True" name="Settings">
<items>
<item commandName="goBackToContentTypes" commandButtonType="SimpleLinkButton" isFilter="False" text="Content types" wrapperTagKey="Span" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="NavigateToContentTypes" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
<item commandName="permissions" commandButtonType="SimpleLinkButton" isFilter="False" text="Permissions" resourceclassid="ModuleBuilderResources" wrapperTagKey="Unknown" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="Permissions" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
</items>
</section>
</sections>
</sidebar>
<contextBar wrapperTagKey="Unknown" />
<scripts>
<script scriptLocation="Telerik.Sitefinity.Resources.Scripts.jquery.shorten.js, Telerik.Sitefinity.Resources" />
<script loadMethodName="OnModuleMasterViewLoaded" scriptLocation="Telerik.Sitefinity.DynamicModules.Web.UI.Backend.Script.MasterGridViewGeneratorExtensions.js, Telerik.Sitefinity" />
</scripts>
<commentsSettingsDefinition postRights="None" />
</view>
<view showTopToolbar="True" webServiceBaseUrl="~/Sitefinity/Services/DynamicModules/Data.svc/?itemType=Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChange" showNavigation="False" createBlankItem="True" unlockDetailItemOnExit="True" isToRenderTranslationView="False" doNotUseContentItemContext="False" multilingualMode="Automatic" showSections="True" masterPageId="00000000-0000-0000-0000-000000000000" dataItemId="00000000-0000-0000-0000-000000000000" enableSocialSharing="False" displayMode="Write" useWorkflow="True" title="Create a Config change" viewType="Telerik.Sitefinity.DynamicModules.Web.UI.Backend.DynamicContentDetailFormView" viewName="Config changeBackendInsertView" type:this="Telerik.Sitefinity.Web.UI.ContentUI.Views.Backend.Master.Config.DetailFormViewElement, Telerik.Sitefinity">
<toolbar wrapperTagKey="Unknown">
<sections>
<section titleWrapperTagKey="Unknown" wrapperTagKey="Div" cssClass="sfWorkflowMenuWrp" visible="True" name="BackendForm">
<items>
<item commandName="save" commandButtonType="Save" isFilter="False" text="Create Config change" wrapperTagKey="Span" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="SaveChangesWidgetElement" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
<item commandName="cancel" commandButtonType="Cancel" isFilter="False" text="Back to Press Releases" wrapperTagKey="Span" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="CancelWidgetElement" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
<item commandName="preview" commandButtonType="Standard" isFilter="False" text="Preview" resourceclassid="Labels" wrapperTagKey="Span" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="PreviewWidgetElement" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
</items>
</section>
</sections>
</toolbar>
<sections>
<sections cssClass="sfFirstForm" wrapperTag="Div" isHiddenInTranslationMode="False" name="MainSection">
<fields>
<field rows="1" id="TitleControl" dataFieldName="Title" displayMode="Write" wrapperTag="Li" title="Title" fieldType="Telerik.Sitefinity.Web.UI.Fields.TextField" cssClass="sfFormSeparator" fieldName="Title" type:this="Telerik.Sitefinity.Web.UI.Fields.Config.TextFieldDefinitionElement, Telerik.Sitefinity">
<expandableDefinition expanded="True" />
<validator expectedFormat="None" maxLength="0" minLength="0" required="True" maxLengthViolationMessage="The input is too long" messageCssClass="sfError" minLengthViolationMessage="The input is too short" requiredViolationMessage="This field is required!" validateIfInvisible="True" />
</field>
</fields>
<expandableDefinition expanded="True" />
</sections>
<sections cssClass="sfExpandableForm" title="More Options" wrapperTag="Div" isHiddenInTranslationMode="False" name="MoreOptions">
<fields>
<field regularExpressionFilter="[^\p{L}\-\!\$\(\)\=\@\d_\’\.]+|\.+$" replaceWith="-" mirroredControlId="TitleControl" enableChangeButton="True" toLower="True" trim="True" rows="1" id="UrlNameFieldControl" dataFieldName="UrlName.PersistedValue" displayMode="Write" wrapperTag="Li" title="UrlNameTitle" example="UrlNameExample" fieldType="Telerik.Sitefinity.Web.UI.Fields.MirrorTextField" resourceClassId="ModuleBuilderResources" cssClass="sfFormSeparator" fieldName="UrlName" type:this="Telerik.Sitefinity.Web.UI.Fields.Config.MirrorTextFieldElement, Telerik.Sitefinity">
<expandableDefinition expanded="True" />
<validator expectedFormat="None" maxLength="-1" minLength="-1" regularExpression="^[\p{L}\-\!\$\(\)\=\@\d_\’~\.]*[\p{L}\-\!\$\(\)\=\@\d_\’~]+$" required="True" messageCssClass="sfError" regularExpressionViolationMessage="The URL contains invalid symbols." requiredViolationMessage="Url name cannot be empty." validateIfInvisible="True" />
</field>
</fields>
<expandableDefinition expanded="False" />
</sections>
<sections cssClass="sfItemReadOnlyInfo" wrapperTag="Div" isHiddenInTranslationMode="False" name="SidebarSection">
<fields>
<field displayMode="Write" wrapperTag="Li" fieldType="Telerik.Sitefinity.Web.UI.Fields.ContentWorkflowStatusInfoField" fieldName="ItemWorkflowStatusInfoField" type:this="Telerik.Sitefinity.Web.UI.Fields.Config.ContentWorkflowStatusInfoFieldElement, Telerik.Sitefinity">
<validator expectedFormat="None" maxLength="-1" minLength="-1" required="False" validateIfInvisible="True" />
<expandableDefinition expanded="True" />
</field>
</fields>
<expandableDefinition expanded="True" />
</sections>
</sections>
<commentsSettingsDefinition postRights="None" />
</view>
<view showTopToolbar="False" webServiceBaseUrl="~/Sitefinity/Services/DynamicModules/Data.svc/?itemType=Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChange" showNavigation="True" createBlankItem="True" unlockDetailItemOnExit="True" doNotUseContentItemContext="False" multilingualMode="Automatic" showSections="True" masterPageId="00000000-0000-0000-0000-000000000000" dataItemId="00000000-0000-0000-0000-000000000000" enableSocialSharing="False" displayMode="Read" useWorkflow="False" title="Preview a Config change" viewType="Telerik.Sitefinity.DynamicModules.Web.UI.Backend.DynamicContentDetailFormView" viewName="Config changeBackendPreviewView" type:this="Telerik.Sitefinity.Web.UI.ContentUI.Views.Backend.Master.Config.DetailFormViewElement, Telerik.Sitefinity">
<toolbar wrapperTagKey="Unknown" />
<sections>
<sections cssClass="sfFirstForm" wrapperTag="Div" isHiddenInTranslationMode="False" name="MainSection">
<fields>
<field rows="1" id="TitleControl" dataFieldName="Title" displayMode="Read" wrapperTag="Li" title="Title" fieldType="Telerik.Sitefinity.Web.UI.Fields.TextField" cssClass="sfFormSeparator" fieldName="Title" type:this="Telerik.Sitefinity.Web.UI.Fields.Config.TextFieldDefinitionElement, Telerik.Sitefinity">
<expandableDefinition expanded="True" />
<validator expectedFormat="None" maxLength="0" minLength="0" required="True" maxLengthViolationMessage="The input is too long" messageCssClass="sfError" minLengthViolationMessage="The input is too short" requiredViolationMessage="This field is required!" validateIfInvisible="True" />
</field>
</fields>
<expandableDefinition expanded="True" />
</sections>
<sections cssClass="sfExpandableForm" title="More Options" wrapperTag="Div" isHiddenInTranslationMode="False" name="MoreOptions">
<fields>
<field regularExpressionFilter="[^\p{L}\-\!\$\(\)\=\@\d_\’\.]+|\.+$" replaceWith="-" mirroredControlId="TitleControl" enableChangeButton="True" toLower="True" trim="True" rows="1" id="UrlNameFieldControl" dataFieldName="UrlName.PersistedValue" displayMode="Read" wrapperTag="Li" title="UrlNameTitle" example="UrlNameExample" fieldType="Telerik.Sitefinity.Web.UI.Fields.MirrorTextField" resourceClassId="ModuleBuilderResources" cssClass="sfFormSeparator" fieldName="UrlName" type:this="Telerik.Sitefinity.Web.UI.Fields.Config.MirrorTextFieldElement, Telerik.Sitefinity">
<expandableDefinition expanded="True" />
<validator expectedFormat="None" maxLength="-1" minLength="-1" regularExpression="^[\p{L}\-\!\$\(\)\=\@\d_\’~\.]*[\p{L}\-\!\$\(\)\=\@\d_\’~]+$" required="True" messageCssClass="sfError" regularExpressionViolationMessage="The URL contains invalid symbols." requiredViolationMessage="Url name cannot be empty." validateIfInvisible="True" />
</field>
</fields>
<expandableDefinition expanded="False" />
</sections>
</sections>
<commentsSettingsDefinition postRights="None" />
</view>
<view showTopToolbar="True" webServiceBaseUrl="~/Sitefinity/Services/DynamicModules/Data.svc/?itemType=Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChange" showNavigation="False" createBlankItem="True" unlockDetailItemOnExit="True" isToRenderTranslationView="False" doNotUseContentItemContext="False" multilingualMode="Automatic" showSections="True" masterPageId="00000000-0000-0000-0000-000000000000" dataItemId="00000000-0000-0000-0000-000000000000" enableSocialSharing="False" displayMode="Write" useWorkflow="True" title="Edit a Config change" viewType="Telerik.Sitefinity.DynamicModules.Web.UI.Backend.DynamicContentDetailFormView" viewName="Config changeBackendEditView" type:this="Telerik.Sitefinity.Web.UI.ContentUI.Views.Backend.Master.Config.DetailFormViewElement, Telerik.Sitefinity">
<toolbar wrapperTagKey="Unknown">
<sections>
<section titleWrapperTagKey="Unknown" wrapperTagKey="Div" cssClass="sfWorkflowMenuWrp" visible="True" name="BackendForm">
<items>
<item commandName="save" commandButtonType="Save" isFilter="False" text="Create Config change" wrapperTagKey="Span" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="SaveChangesWidgetElement" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
<item commandName="cancel" commandButtonType="Cancel" isFilter="False" text="Back to Press Releases" wrapperTagKey="Span" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="CancelWidgetElement" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
<item commandName="preview" commandButtonType="Standard" isFilter="False" text="Preview" resourceclassid="Labels" wrapperTagKey="Span" widgetType="Telerik.Sitefinity.Web.UI.Backend.Elements.Widgets.CommandWidget" isSeparator="False" name="PreviewWidgetElement" type:this="Telerik.Sitefinity.Web.UI.Backend.Elements.Config.CommandWidgetElement, Telerik.Sitefinity" />
</items>
</section>
</sections>
</toolbar>
<sections>
<sections cssClass="sfFirstForm" wrapperTag="Div" isHiddenInTranslationMode="False" name="MainSection">
<fields>
<field rows="1" id="TitleControl" dataFieldName="Title" displayMode="Write" wrapperTag="Li" title="Title" fieldType="Telerik.Sitefinity.Web.UI.Fields.TextField" cssClass="sfFormSeparator" fieldName="Title" type:this="Telerik.Sitefinity.Web.UI.Fields.Config.TextFieldDefinitionElement, Telerik.Sitefinity">
<expandableDefinition expanded="True" />
<validator expectedFormat="None" maxLength="0" minLength="0" required="True" maxLengthViolationMessage="The input is too long" messageCssClass="sfError" minLengthViolationMessage="The input is too short" requiredViolationMessage="This field is required!" validateIfInvisible="True" />
</field>
</fields>
<expandableDefinition expanded="True" />
</sections>
<sections cssClass="sfExpandableForm" title="More Options" wrapperTag="Div" isHiddenInTranslationMode="False" name="MoreOptions">
<fields>
<field regularExpressionFilter="[^\p{L}\-\!\$\(\)\=\@\d_\’\.]+|\.+$" replaceWith="-" mirroredControlId="TitleControl" enableChangeButton="True" toLower="True" trim="True" rows="1" id="UrlNameFieldControl" dataFieldName="UrlName.PersistedValue" displayMode="Write" wrapperTag="Li" title="UrlNameTitle" example="UrlNameExample" fieldType="Telerik.Sitefinity.Web.UI.Fields.MirrorTextField" resourceClassId="ModuleBuilderResources" cssClass="sfFormSeparator" fieldName="UrlName" type:this="Telerik.Sitefinity.Web.UI.Fields.Config.MirrorTextFieldElement, Telerik.Sitefinity">
<expandableDefinition expanded="True" />
<validator expectedFormat="None" maxLength="-1" minLength="-1" regularExpression="^[\p{L}\-\!\$\(\)\=\@\d_\’~\.]*[\p{L}\-\!\$\(\)\=\@\d_\’~]+$" required="True" messageCssClass="sfError" regularExpressionViolationMessage="The URL contains invalid symbols." requiredViolationMessage="Url name cannot be empty." validateIfInvisible="True" />
</field>
</fields>
<expandableDefinition expanded="False" />
</sections>
<sections cssClass="sfItemReadOnlyInfo" wrapperTag="Div" isHiddenInTranslationMode="False" name="SidebarSection">
<fields>
<field displayMode="Write" wrapperTag="Li" fieldType="Telerik.Sitefinity.Web.UI.Fields.ContentWorkflowStatusInfoField" fieldName="ItemWorkflowStatusInfoField" type:this="Telerik.Sitefinity.Web.UI.Fields.Config.ContentWorkflowStatusInfoFieldElement, Telerik.Sitefinity">
<validator expectedFormat="None" maxLength="-1" minLength="-1" required="False" validateIfInvisible="True" />
<expandableDefinition expanded="True" />
</field>
</fields>
<expandableDefinition expanded="True" />
</sections>
</sections>
<commentsSettingsDefinition postRights="None" />
</view>
</views>
</contentViewControl>
{% endhighlight %}

## SecurityConfig.config
A permission element is added underneath the permissions node. Example:
{% highlight xml %}
<permission title="Config changes permissions" description="Represents the most common application security permissions." loginUrl="~/Sitefinity/Login" ajaxLoginUrl="~/Sitefinity/Login/Ajax" name="Configchangetests-ConfigChange">
<actions>
<add title="View Config changes" description="Allows or denies viewing Config changes." type="View" name="View" />
<add title="Create Config changes" description="Allows or denies the creation of new Config changes." type="Create" name="Create" />
<add title="Modify Config changes" description="Allows or denies changes to existing Config changes." type="Modify" name="Modify" />
<add title="Delete Config changes" description="Allows or denies deleting Config changes." type="Delete" name="Delete" />
<add title="Change a Config changes permissions" description="Allows or denies changing the permissions of Config changes." type="ChangePermissions" name="ChangePermissions" />
</actions>
</permission>
{% endhighlight %}

## ToolboxesConfig.config
A tool is added in the tools section. Example:
{% highlight xml %}
<add enabled="True" type="Telerik.Sitefinity.DynamicModules.Web.UI.Frontend.DynamicContentView, Telerik.Sitefinity" title="Config changes" cssClass="sfNewsViewIcn" moduleName="Config change tests" DynamicContentTypeName="Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChange" DefaultMasterTemplateKey="844f4eff-9a33-4799-84e5-2973d7a3db9b" DefaultDetailTemplateKey="7fd83546-0785-4050-998f-06428e7c6fa1" visibilityMode="None" name="Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChange" />
{% endhighlight %}

## WorkflowConfig.config
A workflow type is added in the workflowTypes section. Example:
{% highlight xml %}
<add title="Config change" moduleName="Config change tests" contentType="Telerik.Sitefinity.DynamicTypes.Model.Configchangetests.ConfigChange" />
{% endhighlight %}

## Deactivation
No configuration changes are made in the Sitefinity configuration files when you just deactivate a dynamic module with Module Builder.

Interestingly, when you delete a dynamic module, all of the changes mentioned above are completely reverted EXCEPT the ContentViewConfig.config file. It keeps the config:link element that was added when you added and activated the dynamic module originally. This is curious as it points to a configuration element in DynamicModulesConfig.config that is removed when you delete the dynamic module.
