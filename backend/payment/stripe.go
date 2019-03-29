package payment

import (

	//"bitbucket.org/ctangney/esportsleague/backend/constants"
	"fmt"

	"github.com/yfix/esportsleague/backend/constants"

	stripe "github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/urlfetch"
)

func CreateStripeCustomer(ctx context.Context, stripeTokenID, userID, userEmail string) (*stripe.Customer, error) {
	cus := &stripe.CustomerParams{
		// Desc: "EAL user:" + userID + " (" + userEmail + ")",
	}
	cus.SetSource(stripeTokenID)
	return stripeClient(ctx).Customers.New(cus)
}

func AddStripeSourceToCustomer(ctx context.Context, stripeTokenID, customerID string) (*stripe.Customer, error) {
	client := stripeClient(ctx)

	cus, err := client.Customers.Get(customerID, &stripe.CustomerParams{})
	if err != nil {
		return nil, err
	}

	// // get the cards to delete
	// cardsToDelete := []string{}
	// if cus.Sources != nil && cus.Sources.Count > 0 {
	// 	for _, v := range cus.Sources.Values {
	// 		cardsToDelete = append(cardsToDelete, v.Card.ID)
	// 	}
	// }

	// if _, err = client.Cards.New(&stripe.CardParams{Customer: customerID, Token: stripeTokenID}); err != nil {
	// 	return nil, err
	// }

	// for _, cardID := range cardsToDelete {
	// 	client.Cards.Del(cardID, &stripe.CardParams{Customer: customerID})
	// }

	return cus, err
}

func CheckCouponCode(ctx context.Context, CouponCode string) (*stripe.Coupon, error) {
	cus, err := stripeClient(ctx).Coupons.Get(CouponCode, nil)
	if err != nil {
		return nil, err
	}
	log.Infof(ctx, "coupon info: %v", cus)
	return cus, err
}

func AddCouponCustomer(ctx context.Context, customerID, CouponCode string) (*stripe.Customer, error) {
	customer, err := stripeClient(ctx).Customers.Update(customerID, &stripe.CustomerParams{Coupon: &CouponCode})
	if err != nil {
		return nil, err
	}
	log.Infof(ctx, "updated customer info: %v", customer)
	return customer, err
}

func ChargeStripeCustomer(ctx context.Context, customerID string, amountCents uint64) error {
	cus, err := GetCustomer(ctx, customerID)
	if err != nil {
		return err
	}

	if cus.Sources == nil || cus.Sources.TotalCount == 0 {
		return fmt.Errorf("stripe customer %s has no payment sources", customerID)
	}

	// p := &stripe.ChargeParams{
	// 	Amount:   amountCents,
	// 	Currency: "usd",
	// 	Desc:     "EsportsLeague player fee",
	// 	Customer: cus.ID,
	// }
	// charge, err := stripeClient(ctx).Charges.New(p)
	// log.Infof(ctx, "StripeCharge: %+v, error: %v", charge, err)
	return err
}

func GetCustomer(ctx context.Context, customerID string) (*stripe.Customer, error) {
	return stripeClient(ctx).Customers.Get(customerID, nil)
}

func stripeClient(ctx context.Context) *client.API {
	httpClient := urlfetch.Client(ctx)
	return client.New(constants.GetConfig(ctx).StripePrivateKey, stripe.NewBackends(httpClient))
}
