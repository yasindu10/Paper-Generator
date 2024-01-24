const paypal = require('paypal-rest-sdk')

const createPayment = async (req, res) => {
    const create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            return_url: `http://localhost:${process.env.PORT || 8080
                }/api/v1/payment/success`,
            cancel_url: `http://localhost:${process.env.PORT || 8080
                }/api/v1/payment/cancel`,
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "yTools",
                            sku: "001",
                            price: '15',
                            currency: "USD",
                            quantity: '1',
                        },
                    ],
                },
                amount: {
                    currency: "USD",
                    total: `15`,
                },
                description: "Payment for yTools APP",
            },
        ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            res.status(error.httpStatusCode).json({ error: error.message });
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
}

const successPayment = async (req, res) => {
    const paymentId = req.query.paymentId;
    const payerId = req.query.PayerID;

    paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
        if (error) {
            res.status(payment.httpStatusCode).send(`<div style="display: flex;
                                  justify-content: center;
                                  align-items: center;
                        height: 100vh;">
                        <h1 style="text-align: center;">This is a centered heading</h1>
                      </div>`);
        } else {
            res.status(200).send(`<h3>Payment Success</h3>`)
        }
    });
}

const cancelPayment = (req, res) => {
    const htmlPart = `
        <h3>Cancel payment</h3>
    `
    res.status(400).send(htmlPart)
}

module.exports = { createPayment, successPayment, cancelPayment }