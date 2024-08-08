async function getAccessToken(callback) {
    try {
        const resp = await fetch('/api/auth/token');
        if (!resp.ok)
            throw new Error(await resp.text());
        const { access_token, expires_in } = await resp.json();
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);        
    }
}

export function initViewer(container) {
    return new Promise(function (resolve, reject) {
            Autodesk.Viewing.Initializer({ env: 'AutodeskProduction2', api:"streamingV2", getAccessToken }, function () {
            const config = {
                //extensions: ['Autodesk.DocumentBrowser','MyExtension']
            };

            const viewer = new Autodesk.Viewing.AggregatedView();
            viewer.init(container, config);

            // const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            // viewer.start();
            // viewer.setTheme('light-theme');
            window.myviewer = viewer
            resolve(viewer);
        });
    });
}

export function loadModel(viewer, urn) {
    function onDocumentLoadSuccess(doc) {
        var bubble = doc.getRoot().getDefaultGeometry();
        
        viewer.setNodes(bubble)
        viewer.viewer.loadExtension(
            'MyExtension'
        )

        //viewer.loadDocumentNode(doc.)

    }
    function onDocumentLoadFailure(code, message) {
        alert('Could not load model. See console for more details.');
        console.error(message);
    }
    Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
}
