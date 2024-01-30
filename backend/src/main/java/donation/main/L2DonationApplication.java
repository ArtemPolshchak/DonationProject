package donation.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
//@EnableTransactionManagement
public class L2DonationApplication {

    	public static void main(String[] args) {
		SpringApplication.run(L2DonationApplication.class, args);
	}
}
