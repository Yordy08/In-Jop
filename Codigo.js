function doGet() {
    return HtmlService.createHtmlOutputFromFile("index").setTitle("Contabilidad de Ventas");
  }
  
  function addSale(data) {
    try {
      const spreadsheetId = '1Bpy5QGBwRdtBHvs_XbGQU3xvZwl43vM-nk9xGlioWPY'; // Reemplaza con tu ID de hoja de cálculo
      const sheetName = "Ventas";
  
      // Acceso a la hoja de cálculo
      const ss = SpreadsheetApp.openById(spreadsheetId);
      let sheet = ss.getSheetByName(sheetName);
  
      // Crear la hoja si no existe
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        sheet.appendRow(["Fecha", "Vendedor", "Comprador", "Whatsapp", "Descripción", "Productos", "Cantidad", "Precio Unitario", "Sub Total", "Total"]); // Encabezados
      }
  
      // Variables para acumular el total
      let totalVenta = 0;
      let productosDetalles = [];
      let cantidadTotal = 0;
  
      // Asegurarnos de que data.productosSeleccionados sea un objeto no nulo
      if (data && data.productosSeleccionados) {
        // Recorrer los productos seleccionados y calcular subtotal por producto
        for (const [producto, info] of Object.entries(data.productosSeleccionados)) {
          // Verificar que la cantidad y precio estén definidos y sean números
          if (typeof info.cantidad === 'number' && info.cantidad > 0 && typeof info.precio === 'number' && info.precio > 0) {
            let subTotal = info.cantidad * info.precio; // Calculamos el subtotal
            totalVenta += subTotal; // Acumulamos el total
            cantidadTotal += info.cantidad; // Acumulamos la cantidad total
  
            // Agregar los detalles del producto al array
            productosDetalles.push(`${producto}: ${info.cantidad} x $${info.precio.toLocaleString("es-CO")} = $${subTotal.toLocaleString("es-CO")}`);
          } else {
            throw new Error(`El producto ${producto} tiene una cantidad o precio inválido.`);
          }
        }
      } else {
        throw new Error("No se seleccionaron productos.");
      }
  
      // Registrar la venta en la hoja
      sheet.appendRow([
        new Date(),
        data.vendedor || "No especificado", // Asegurarse de que siempre haya un valor para el vendedor
        data.comprador || "No especificado", // Asegurarse de que siempre haya un valor para el comprador
        data.whatsapp || "No especificado", // Asegurarse de que siempre haya un valor para WhatsApp
        data.descripcion || "No especificada", // Asegurarse de que siempre haya un valor para la descripción
        productosDetalles.join(", "), // Concatenamos los productos con sus cantidades y precios
        cantidadTotal, // Cantidad total de productos
        "", // Precio unitario no se almacena globalmente
        "", // Subtotal no se almacena globalmente
        totalVenta // Total de la venta
      ]);
  
      return "Venta registrada correctamente.";
    } catch (error) {
      // Manejo del error con un mensaje detallado
      return `No se pudo registrar la venta: ${error.message}`;
    }
  }
  