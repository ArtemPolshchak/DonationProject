package donation.main.repositories.spec;

public interface SpecProviderManager<T> {
    SpecProvider<T> getSpecProvider(String key);
}
