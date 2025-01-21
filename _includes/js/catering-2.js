$(document).ready(function () {
  // Calculate and update total
  function updateTotal() {
    let total = 0;

    // Calculate tray costs
    total += $("#classicTrayCount").val() * 80;
    total += $("#signatureTrayCount").val() * 100;

    // Calculate addon costs
    $('input[name="addons"]:checked').each(function () {
      const $checkbox = $(this);
      const price = parseFloat($checkbox.data("price"));
      const quantity = parseInt(
        $checkbox.closest("div").find(".addon-quantity").val()
      );
      total += price * quantity;
    });

    $("#orderTotal").text(total.toFixed(2));
  }

  // Event listeners for tray selection
  $("#classicTrayCount, #signatureTrayCount").change(updateTotal);

  // Event listeners for addons
  $('input[name="addons"]').change(function () {
    const $checkbox = $(this);
    const $quantityInput = $checkbox.closest("div").find(".addon-quantity");

    if ($checkbox.is(":checked")) {
      $quantityInput.prop("disabled", false).val(1);
    } else {
      $quantityInput.prop("disabled", true).val(0);
    }

    updateTotal();
  });

  // Event listeners for addon quantities
  $(".addon-quantity").change(function () {
    if ($(this).val() < 0) {
      $(this).val(0);
    }
    updateAddonTotal($(this));
    updateTotal();
  });

  function updateAddonTotal($quantityInput) {
    const $container = $quantityInput.closest(".flex");
    const $checkbox = $container.parent().find('input[type="checkbox"]');
    const $totalSpan = $container.find(".addon-total");
    const price = parseFloat($checkbox.data("price"));
    const quantity = parseInt($quantityInput.val()) || 0;
    const total = price * quantity;
    $totalSpan.text("$" + total.toFixed(2));
  }

  // Navigation between steps
  $("#nextToStep2").click(function () {
    // Validate at least one tray is selected
    const totalTrays =
      parseInt($("#classicTrayCount").val()) +
      parseInt($("#signatureTrayCount").val());

    if (totalTrays === 0) {
      alert("Please select at least one tray");
      return;
    }

    $("#step1").addClass("hidden");
    $("#step2").removeClass("hidden");
  });

  $("#backToStep1").click(function () {
    $("#step2").addClass("hidden");
    $("#step1").removeClass("hidden");
  });

  // Form submission
  $("#cateringForm").submit(function (e) {
    e.preventDefault();

    const formData = {
      order: {
        classicTrays: $("#classicTrayCount").val(),
        signatureTrays: $("#signatureTrayCount").val(),
        addons: $('input[name="addons"]:checked')
          .map(function () {
            const $checkbox = $(this);
            return {
              item: $checkbox.val(),
              quantity: parseInt(
                $checkbox.closest("div").find(".addon-quantity").val()
              ),
            };
          })
          .get(),
        total: $("#orderTotal").text(),
      },
      event: {
        fullName: $("#fullName").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        eventDate: $("#eventDate").val(),
        guestCount: $("#guestCount").val(),
        eventType: $("#eventType").val(),
        pickupType: $("#pickupType").val(),
        eventLocation: $("#eventLocation").val(),
        comments: $("#comments").val(),
      },
    };

    console.log("Form submitted:", formData);
    alert("Thank you for your order! We will contact you shortly.");
  });
});
