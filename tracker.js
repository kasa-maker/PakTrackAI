// Dummy locations for Pakistan Post
const cities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Gujranwala", "Sialkot",
  "Bahawalpur", "Hyderabad", "Sukkur", "Abbottabad", "Mardan"
];

const statuses = [
  "In Transit", "Out for Delivery", "Delivered", "Processing", "Dispatched"
];

// Generate dummy tracking data for B25330 - B2533049 range
function generateDummyTracking(trackingNumber) {
  const cleanId = trackingNumber.trim().toUpperCase();

  // Extract numeric part
  const numPart = cleanId.replace(/^[A-Za-z]+/, "");
  const num = parseInt(numPart);

  // Valid range: B25330 to B2533049 (numeric part: 25330 to 2533049)
  if (!numPart || num < 25330 || num > 2533049) {
    return null;
  }

  // Check if starts with B
  if (!/^[A-Z]/.test(cleanId)) {
    return null;
  }

  // Use tracking number as seed for consistent dummy data
  let seed = 0;
  for (let i = 0; i < cleanId.length; i++) {
    seed += cleanId.charCodeAt(i);
  }

  const random = (min, max) => {
    seed = (seed * 9301 + 49297) % 233280;
    return Math.floor((seed / 233280) * (max - min + 1)) + min;
  };

  // Generate consistent dummy data
  const currentCity = cities[random(0, cities.length - 1)];
  const originCity = cities[random(0, cities.length - 1)];
  const status = statuses[random(0, statuses.length - 1)];

  // Generate dates
  const dispatchDaysAgo = random(1, 10);
  const dispatchDate = new Date();
  dispatchDate.setDate(dispatchDate.getDate() - dispatchDaysAgo);

  const estimatedDays = random(1, 5);
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDays);

  // Generate tracking events
  const events = [
    {
      date: dispatchDate.toISOString(),
      status: "Parcel received at origin facility",
      location: originCity
    }
  ];

  if (status === "Dispatched" || status === "In Transit" || status === "Out for Delivery" || status === "Delivered") {
    const transitDate = new Date(dispatchDate);
    transitDate.setDate(transitDate.getDate() + random(1, 3));
    events.push({
      date: transitDate.toISOString(),
      status: "In transit to destination",
      location: currentCity
    });
  }

  if (status === "Out for Delivery" || status === "Delivered") {
    const outForDeliveryDate = new Date();
    outForDeliveryDate.setHours(8, 0, 0);
    events.push({
      date: outForDeliveryDate.toISOString(),
      status: "Out for delivery",
      location: currentCity
    });
  }

  if (status === "Delivered") {
    const deliveredDate = new Date();
    deliveredDate.setHours(random(9, 18), random(0, 59));
    events.push({
      date: deliveredDate.toISOString(),
      status: "Delivered successfully",
      location: currentCity
    });
  }

  return {
    tracking_number: cleanId,
    courier_code: "pakistan-post",
    status: status.toLowerCase(),
    status_detail: status,
    origin_info: {
      country: "Pakistan",
      state: "Punjab",
      city: originCity
    },
    destination_info: {
      country: "Pakistan",
      city: currentCity
    },
    tracking_detail: {
      tracking_info: events.sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    days_after_dispatch: dispatchDaysAgo,
    estimated_delivery_date: estimatedDelivery.toISOString(),
    weight: (random(100, 5000) / 1000).toFixed(2) + " kg",
    is_dummy: true
  };
}

async function addTracking(trackingNumber) {
  const cleanId = trackingNumber.trim().toUpperCase();
  const numPart = cleanId.replace(/^[A-Za-z]+/, "");
  const num = parseInt(numPart);

  // If ID is in dummy range (B25330 - B2533049), return dummy data directly
  if (numPart && num >= 25330 && num <= 2533049 && /^[A-Z]/.test(cleanId)) {
    return { meta: { code: 200 }, data: [generateDummyTracking(trackingNumber)] };
  }

  // Check if API key is configured
  if (CONFIG.TRACKINGMORE_API_KEY === "your_trackingmore_api_key_here" || !CONFIG.TRACKINGMORE_API_KEY) {
    return { meta: { code: 200 }, data: [generateDummyTracking(trackingNumber)] };
  }

  try {
    const response = await fetch("https://api.trackingmore.com/v4/trackings/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Tracking-Api-Key": CONFIG.TRACKINGMORE_API_KEY,
      },
      body: JSON.stringify({
        tracking_number: trackingNumber,
        courier_code: "pakistan-post",
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Using dummy data (API failed):", error);
    return { meta: { code: 200 }, data: [generateDummyTracking(trackingNumber)] };
  }
}

async function getTracking(trackingNumber) {
  const cleanId = trackingNumber.trim().toUpperCase();
  const numPart = cleanId.replace(/^[A-Za-z]+/, "");
  const num = parseInt(numPart);

  // If ID is in dummy range (B25330 - B2533049), return dummy data directly
  if (numPart && num >= 25330 && num <= 2533049 && /^[A-Z]/.test(cleanId)) {
    return { meta: { code: 200 }, data: [generateDummyTracking(trackingNumber)] };
  }

  // Check if API key is configured
  if (CONFIG.TRACKINGMORE_API_KEY === "your_trackingmore_api_key_here" || !CONFIG.TRACKINGMORE_API_KEY) {
    return { meta: { code: 200 }, data: [generateDummyTracking(trackingNumber)] };
  }

  try {
    const response = await fetch(
      `https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${trackingNumber}&courier_code=pakistan-post`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Tracking-Api-Key": CONFIG.TRACKINGMORE_API_KEY,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Using dummy data (API failed):", error);
    return { meta: { code: 200 }, data: [generateDummyTracking(trackingNumber)] };
  }
}

async function trackParcel(trackingNumber) {
  try {
    await addTracking(trackingNumber);
    const result = await getTracking(trackingNumber);

    if (result.data && result.data.length > 0) {
      return result.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Tracking error:", error);
    return generateDummyTracking(trackingNumber);
  }
}